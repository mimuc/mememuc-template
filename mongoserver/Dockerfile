FROM mongo:latest
 COPY . .
 CMD mongorestore -c users --uri "mongodb://mongo:27017/omm-2021" ./data/users.bson
