[
"insert into users (email, password) values ('admin3@mail.com','$2a$11$BFHuTGPgWkekaELdGtYwsu0opBpBpH/.pZDb2UtxdUe8B7KdD4Ihq');",
"insert into items (items.name, items.description, items.price) values ('name01','description01','3');",
"insert into images (item_id,url) values ((select id from items where name = 'name01'),'https://fake.url/img.jpg');"
]
