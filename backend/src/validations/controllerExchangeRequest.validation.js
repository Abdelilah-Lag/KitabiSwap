// Validation minimaliste (pattern existant dans le projet)

export function validateAcceptControllerExchangeRequestBody(body) {
  // Selon l'architecture future: on peut valider message, catalog_data, etc.
  // Pour l'instant: aucune donnée requise.
  return {
    catalog_data: body?.catalog_data ?? null,
    note: body?.note ?? null
  };
}

