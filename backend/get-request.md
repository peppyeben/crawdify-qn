# API Documentation

## Base URL

```
http://localhost:3000/api/v0/
```

## Routes

### `GET /store`

This route retrieves data from the specified collection in the database.

#### Request Body

The `GET /store` endpoint expects a JSON body with the following fields:

- **collection_name** (string, required): The name of the collection in the database. Must be a non-empty string and must match the environment variable `WEAVEDB_COLLECTION_NAME`.
- **data** (object, optional): Object containing additional filters for querying the data. This object may include:
  - **userAddress** (string, optional): Filters data based on the user's address.
  - **category** (string, optional): Filters data based on the category.
  - **doc_id** (string, optional): Queries data by document ID.

If no `data` is provided, the default action is to retrieve up to 10 documents from the specified collection.

#### Sample Request Body

```json
{
  "data": {
    "userAddress": "8MYanvEsNGQ1r8mZhpBDQwzojFWp8yV5oEjfQtNBVYaV"
  },
  "collection_name": "pledgepact"
}
```

#### Validation Checks

- If the `collection_name` is not a string, is empty, or does not match the environment variable `WEAVEDB_COLLECTION_NAME`, the request will fail with a `400` error and the message `"collection_name must be a non-empty string or match"`.
- If the `data` object is provided but is not a valid object, is empty, or its keys do not match any expected filter (like `userAddress`, `category`, or `doc_id`), the request will return a `400` error with the message `"data must be a non-empty object."`.

#### Sample Valid Requests

1. **Request with `userAddress`:**

   Request Body:

   ```json
   {
     "data": {
       "userAddress": "8MYanvEsNGQ1r8mZhpBDQwzojFWp8yV5oEjfQtNBVYaV"
     },
     "collection_name": "pledgepact"
   }
   ```

2. **Request with `category`:**

   Request Body:

   ```json
   {
     "data": {
       "category": "some_category"
     },
     "collection_name": "pledgepact"
   }
   ```

3. **Request with `doc_id`:**

   Request Body:

   ```json
   {
     "data": {
       "doc_id": "some_document_id"
     },
     "collection_name": "pledgepact"
   }
   ```

4. **Request without `data` (retrieves up to 10 documents):**

   Request Body:

   ```json
   {
     "collection_name": "pledgepact"
   }
   ```

#### Sample Invalid Requests

1. **Missing `collection_name` or invalid `collection_name`:**

   Request Body:

   ```json
   {
     "data": {
       "userAddress": "8MYanvEsNGQ1r8mZhpBDQwzojFWp8yV5oEjfQtNBVYaV"
     }
   }
   ```

   Response:

   ```json
   {
     "message": "collection_name must be a non-empty string or match",
     "status": 400
   }
   ```

2. **Invalid `data` field:**

   Request Body:

   ```json
   {
     "data": "invalid_data",
     "collection_name": "pledgepact"
   }
   ```

   Response:

   ```json
   {
     "message": "data must be a non-empty object.",
     "status": 400
   }
   ```
