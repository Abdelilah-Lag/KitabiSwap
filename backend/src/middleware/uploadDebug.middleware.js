export function logUploadFields(req, res, next) {
  try {
    // Multer populates req.file / req.files AFTER parsing.
    // This middleware is placed BEFORE upload to show what arrives.
    const hasBody = req.body && Object.keys(req.body).length > 0;
    // For multipart requests, req.body is often empty before multer.

    // eslint-disable-next-line no-console
    console.log("[uploadDebug] content-type:", req.headers["content-type"]);
    // eslint-disable-next-line no-console
    console.log("[uploadDebug] body keys (pre-multer):", hasBody ? Object.keys(req.body) : []);

    next();
  } catch (e) {
    next();
  }
}

