# Download:

## Sender:
- carica un file
- encrypt del file
- invia un file cryptato al server
- check grandezza (max 10MB)

## Server:
- check grandezza (max 10MB)
- salva il file con un nome random (16 bytes)
- invia al reciver il link del file
- quando il file viene scaricato, viene rimosso

## Client:
- riceve un nuovo messaggio di tipo file con l'url del file
- download tramite fetch del file
- decrypt del file e download da browser