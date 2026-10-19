import prisma from "../config/prisma.js";

function toNumber(value) {

    return value == null ? 0 : Number(value);

}

export async function getUserDashboard(userId) {

    const safeUserId = BigInt(userId);

    const user = await prisma.users.findUnique({

        where: {

            id: safeUserId

        },

        select: {

            id: true,

            first_name: true,

            last_name: true,

            email: true,

            avatar_url: true

        }

    });

    const wallet = await prisma.wallets.findUnique({

        where: {

            user_id: safeUserId

        },

        select: {

            id: true,

            balance: true

        }

    });

    const [booksCount, exchangesCount, ordersCount, recentBooks, exchangeRequests] = await Promise.all([

        prisma.user_books.count({

            where: {

                user_id: safeUserId

            }

        }),

        prisma.exchange_requests.count({

            where: {

                OR: [

                    {

                        requester_id: safeUserId

                    },

                    {

                        receiver_id: safeUserId

                    }

                ]

            }

        }),

        prisma.book_orders.count({

            where: {

                user_id: safeUserId

            }

        }),

        prisma.user_books.findMany({

            where: {

                user_id: safeUserId

            },

            take: 5,

            orderBy: {

                created_at: "desc"

            },

            include: {

                books_catalog: {

                    select: {

                        id: true,

                        title: true,

                        author: true,

                        book_images: {

                            where: {

                                is_cover: true

                            },

                            take: 1,

                            select: {

                                image_url: true

                            }

                        }

                    }

                }

            }

        }),

        prisma.exchange_requests.findMany({

            where: {

                OR: [

                    { requester_id: safeUserId },

                    { receiver_id: safeUserId }

                ]

            },

            orderBy: {

                created_at: "desc"

            },

            take: 10,

            select: {

                id: true,

                requester_id: true,

                receiver_id: true,

                status: true,

                requester_books: true,

                receiver_books: true,

                requester_message: true,

                receiver_confirmed: true,

                created_at: true,

                expires_at: true

            }

        })

    ]);

    // Map exchange request book IDs -> titles (for dashboard display)
    const allExchangeBookIds = exchangeRequests.flatMap(r => {
        const requesterArr = (() => {
            try {
                return Array.isArray(r.requester_books) ? r.requester_books : JSON.parse(r.requester_books);
            } catch { return []; }
        })();
        const receiverArr = (() => {
            try {
                return Array.isArray(r.receiver_books) ? r.receiver_books : JSON.parse(r.receiver_books);
            } catch { return []; }
        })();
        return [...requesterArr, ...receiverArr].map(Number);
    }).filter(Boolean);

    const uniqueExchangeBookIds = [...new Set(allExchangeBookIds)];

    let exchangeBookIdToTitle = new Map();
    if (uniqueExchangeBookIds.length > 0) {
        // requester_books/receiver_books are user_books IDs.
        const userBooks = await prisma.user_books.findMany({
            where: {
                id: { in: uniqueExchangeBookIds.map(id => BigInt(id)) }
            },
            select: {
                id: true,
                books_catalog: { select: { title: true } }
            }
        });

        exchangeBookIdToTitle = new Map(
            userBooks.map(ub => [Number(ub.id), ub.books_catalog?.title || ""])
        );
    }

    // Apply titles into exchangeRequests payload
    const exchangeRequestsWithTitles = (exchangeRequests || []).map(r => {
        const parseBooks = (value) => {
            try {
                const arr = typeof value === "string" ? JSON.parse(value) : value;
                return Array.isArray(arr) ? arr : [];
            } catch { return []; }
        };

        const requester_books = parseBooks(r.requester_books).map(Number);
        const receiver_books = parseBooks(r.receiver_books).map(Number);

        const requester_books_titles = requester_books.map(id => exchangeBookIdToTitle.get(id)).filter(Boolean);
        const receiver_books_titles = receiver_books.map(id => exchangeBookIdToTitle.get(id)).filter(Boolean);

        return {
            id: Number(r.id),
            requester_id: Number(r.requester_id),
            receiver_id: Number(r.receiver_id),
            status: r.status,
            requester_message: r.requester_message,
            requester_books,
            receiver_books,
            requester_books_titles,
            receiver_books_titles,
            receiver_confirmed: !!r.receiver_confirmed,
            created_at: r.created_at,
            expires_at: r.expires_at
        };
    });

    const recentTransactions = wallet


        ? await prisma.wallet_transactions.findMany({

            where: {

                wallet_id: wallet.id

            },

            take: 5,

            orderBy: {

                created_at: "desc"

            },

            select: {

                id: true,

                transaction_type: true,

                amount: true,

                description: true,

                created_at: true

            }

        })

        : [];

    const notifications = await prisma.messages.findMany({

        where: {

            receiver_id: safeUserId

        },

        orderBy: {

            created_at: "desc"

        },

        take: 10,

        select: {

            id: true,

            message: true,

            image_url: true,

            is_read: true,

            created_at: true,

            users_messages_sender_idTousers: {

                select: {

                    id: true,

                    first_name: true,

                    last_name: true,

                    avatar_url: true

                }

            }

        }

    });

    await prisma.messages.updateMany({

        where: {

            receiver_id: safeUserId,

            is_read: false

        },

        data: {

            is_read: true

        }

    });

    return {

        user: user

            ? {

                ...user,

                id: Number(user.id)

            }

            : {

                id: Number(userId),

                first_name: "",

                last_name: "",

                email: "",

                avatar_url: null

            },

        wallet: {

            id: wallet ? Number(wallet.id) : null,

            balance: wallet ? toNumber(wallet.balance) : 0

        },

        exchangeRequests: exchangeRequestsWithTitles,




        stats: {

            books: booksCount,

            exchanges: exchangesCount,

            orders: ordersCount

        },

        recentBooks: recentBooks.map(book => ({

            id: Number(book.id),

            title: book.books_catalog?.title || "Untitled",

            author: book.books_catalog?.author || "Unknown",

            cover:

                book.books_catalog?.book_images?.[0]?.image_url ||

                "https://placehold.co/300x420"

        })),

        recentTransactions: recentTransactions.map(transaction => ({

            id: Number(transaction.id),

            type: transaction.transaction_type,

            amount: toNumber(transaction.amount),

            description: transaction.description || "Transaction",

            created_at: transaction.created_at

        })),

        notifications: notifications.map(notification => ({

            id: Number(notification.id),

            sender: notification.users_messages_sender_idTousers

                ? {

                    id: Number(notification.users_messages_sender_idTousers.id),

                    name: `${notification.users_messages_sender_idTousers.first_name || ""} ${notification.users_messages_sender_idTousers.last_name || ""}`.trim(),

                    avatar_url: notification.users_messages_sender_idTousers.avatar_url

                }

                : null,

            message: notification.message || "Nouveau message",

            image_url: notification.image_url || null,

            is_read: notification.is_read,

            created_at: notification.created_at

        }))

    };

}