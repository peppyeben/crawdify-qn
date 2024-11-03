### `POST /store`

This route is used to store a new campaign in the database under the specified collection.

#### Request Body

The `POST /store` endpoint expects a JSON body with the following fields:

- **data** (object, required): This object contains the campaign details. The fields inside the `data` object must follow these rules:
  - **name** (string, required): A non-empty string representing the title of the campaign. It must be at least 3 characters long.
  - **description** (string, required): A non-empty string describing the campaign. It must be at least 3 characters long.
  - **goal** (number, required): The goal amount for the campaign, which must be a number greater than 0.
  - **endDate** (number, required): A timestamp representing the end date of the campaign. It must be greater than the current time.
  - **userAddress** (string, required): The address of the user who created the campaign. It must be a non-empty string at least 3 characters long.
- **collection_name** (string, required): The name of the collection in the database. It must be a non-empty string.

#### Sample Request Body

```json
{
  "data": {
    "name": "Help Joe learn Web Development",
    "description": "Help Joe learn Web Development",
    "goal": 0.5,
    "endDate": 1728328582,
    "userAddress": "8MYanvEsNGQ1r8mZhpBDQwzojFWp8yV5oEjfQtNBVYaV"
  },
  "collection_name": "pledgepact"
}
```

#### Validation Checks

- **data**: Must be a non-empty object. If this is not provided, or if it’s an empty object, the request will return a `400` error with the message `"data must be a non-empty object."`.
- **name**: Must be a non-empty string with at least 3 characters. If this check fails, a `400` error with the message `"name must be a non-empty string"` will be returned.
- **description**: Must be a non-empty string with at least 3 characters. If this check fails, a `400` error with the message `"description must be a non-empty string"` will be returned.
- **goal**: Must be a number greater than 0. If this check fails, a `400` error with the message `"goal must be greater than zero"` will be returned.
- **endDate**: Must be a valid timestamp greater than the current time. If this check fails, a `400` error with the message `"endDate must be greater than current time"` will be returned.
- **userAddress**: Must be a non-empty string with at least 3 characters. If this check fails, a `400` error with the message `"userAddress must be a non-empty string"` will be returned.
- **collection_name**: Must be a non-empty string. If this check fails, a `400` error with the message `"collection_name must be a non-empty string."` will be returned.

#### Sample Valid Requests

1. **Valid Campaign Creation Request:**

   ```json
   {
     "data": {
       "name": "Help Joe learn Web Development",
       "description": "Help Joe learn Web Development",
       "goal": 0.5,
       "endDate": 1728328582,
       "userAddress": "8MYanvEsNGQ1r8mZhpBDQwzojFWp8yV5oEjfQtNBVYaV"
     },
     "collection_name": "pledgepact"
   }
   ```

2. **Another Valid Request:**

   ```json
   {
     "data": {
       "name": "Fund the community center",
       "description": "A campaign to fund the construction of a new community center.",
       "goal": 5000,
       "endDate": 1740000000,
       "userAddress": "9XYanvEsNGQ1r8mZhpBDQwzojFWp8yV5oEjfQtNBNYU"
     },
     "collection_name": "community"
   }
   ```

#### Sample Invalid Requests

1. **Invalid `data` (Empty object):**

   Request Body:

   ```json
   {
     "data": {},
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

2. **Invalid `name` (Too short):**

   Request Body:

   ```json
   {
     "data": {
       "name": "He",
       "description": "Help Joe learn Web Development",
       "goal": 0.5,
       "endDate": 1728328582,
       "userAddress": "8MYanvEsNGQ1r8mZhpBDQwzojFWp8yV5oEjfQtNBVYaV"
     },
     "collection_name": "pledgepact"
   }
   ```

   Response:

   ```json
   {
     "message": "name must be a non-empty string",
     "status": 400
   }
   ```

3. **Invalid `goal` (Non-positive):**

   Request Body:

   ```json
   {
     "data": {
       "name": "Help Joe learn Web Development",
       "description": "Help Joe learn Web Development",
       "goal": -10,
       "endDate": 1728328582,
       "userAddress": "8MYanvEsNGQ1r8mZhpBDQwzojFWp8yV5oEjfQtNBVYaV"
     },
     "collection_name": "pledgepact"
   }
   ```

   Response:

   ```json
   {
     "message": "goal must be greater than zero",
     "status": 400
   }
   ```

4. **Invalid `endDate` (Past timestamp):**

   Request Body:

   ```json
   {
     "data": {
       "name": "Help Joe learn Web Development",
       "description": "Help Joe learn Web Development",
       "goal": 0.5,
       "endDate": 1628328582,
       "userAddress": "8MYanvEsNGQ1r8mZhpBDQwzojFWp8yV5oEjfQtNBVYaV"
     },
     "collection_name": "pledgepact"
   }
   ```

   Response:

   ```json
   {
     "message": "endDate must be greater than current time",
     "status": 400
   }
   ```
