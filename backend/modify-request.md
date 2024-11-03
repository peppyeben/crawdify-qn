### `PATCH /store`

This route is used to modify an existing document in the specified collection in the database. You can selectively update the fields by passing only the fields that need to be modified in the `data` object.

#### Request Body

The `PATCH /store` endpoint expects a JSON body with the following fields:

-   **data** (object, required): An object containing the fields you want to modify. You can include one or more of the following fields:
    -   **name** (string, optional): A non-empty string representing the new title of the campaign.
    -   **description** (string, optional): A non-empty string representing the new description of the campaign.
    -   **campaignAddress** (string, optional): A non-empty string representing the new address for the campaign.
    -   **imageUrl** (string, optional): A non-empty string containing the URL of the campaign image.
-   **collection_name** (string, required): The name of the collection in the database. It must be a non-empty string.
-   **doc_id** (string, required): The unique document ID of the campaign to be updated. It must be a non-empty string.

#### Sample Request Body

```json
{
    "data": {
        "name": "Help Joe learn Fashion"
    },
    "collection_name": "pledgepact",
    "doc_id": "a934a1e9c1c5f5ef32ac859a2cb120e3"
}
```

#### Validation Checks

-   **data**: Must be a non-empty object. If this is not provided, or if it's an empty object, the request will return a `400` error with the message `"data must be a non-empty object."`.
-   **doc_id**: Must be a non-empty string. If this is not provided or is an empty string, the request will return a `400` error with the message `"doc_id must be a non-empty string"`.
-   **name**: Must be a non-empty string, if included. Empty or null strings are ignored and won't update the field.
-   **description**: Must be a non-empty string, if included. Empty or null strings are ignored and won't update the field.
-   **campaignAddress**: Must be a non-empty string, if included. Empty or null strings are ignored and won't update the field.
-   **imageUrl**: Must be a non-empty string, if included. Empty or null strings are ignored and won't update the field.
-   **collection_name**: Must be a non-empty string. If this is not provided or is an empty string, the request will return a `400` error with the message `"collection_name must be a non-empty string."`.

#### Sample Valid Requests

1. **Valid Request to Modify a Campaign Title:**

    ```json
    {
        "data": {
            "name": "Help Joe learn Fashion"
        },
        "collection_name": "pledgepact",
        "doc_id": "a934a1e9c1c5f5ef32ac859a2cb120e3"
    }
    ```

2. **Valid Request to Modify Multiple Fields:**

    ```json
    {
        "data": {
            "description": "A new description for the campaign",
            "campaignAddress": "12bQfjEbJjAcN2oSZRTTYQvEfxE3x7hpQpaZNsgHTJo"
        },
        "collection_name": "pledgepact",
        "doc_id": "b29d9c4b84db7e943ef8738aaf2b29c2"
    }
    ```

#### Sample Invalid Requests

1. **Invalid `data` (Empty object):**

    Request Body:

    ```json
    {
        "data": {},
        "collection_name": "pledgepact",
        "doc_id": "a934a1e9c1c5f5ef32ac859a2cb120e3"
    }
    ```

    Response:

    ```json
    {
        "message": "data must be a non-empty object.",
        "status": 400
    }
    ```

2. **Invalid `doc_id` (Empty string):**

    Request Body:

    ```json
    {
        "data": {
            "name": "Help Joe learn Fashion"
        },
        "collection_name": "pledgepact",
        "doc_id": ""
    }
    ```

    Response:

    ```json
    {
        "message": "doc_id must be a non-empty string",
        "status": 400
    }
    ```

3. **Invalid `collection_name` (Empty string):**

    Request Body:

    ```json
    {
        "data": {
            "name": "Help Joe learn Fashion"
        },
        "collection_name": "",
        "doc_id": "a934a1e9c1c5f5ef32ac859a2cb120e3"
    }
    ```

    Response:

    ```json
    {
        "message": "collection_name must be a non-empty string.",
        "status": 400
    }
    ```
