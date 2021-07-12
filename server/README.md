# Server

## Endpoints
- **POST** /api/claim {invoiceId: int}
- 

## Socket.io
Handle chat events, we a new chat is instantiated establish a E2E encryption between the two clients and exchange the secrets, forward messages once the connection is established

## Socket events:
- middleware: check if jwt token is valid, return error if expired or not valid (connect_error)
- connection: save user

- newChat: {id: string, p: buffer, g: buffer, A: buffer}
- newChatComplete: {id: string, B: buffer}

- sendMessage {id: string, message: string, iv: buffer}