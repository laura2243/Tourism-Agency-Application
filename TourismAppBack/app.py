from setup import app, db
import user, destination, reservation

with app.app_context():
    db.create_all()
if __name__ == '__main__':
    app.run(ssl_context=('localhost.pem','localhost-key.pem'),port=5000)

#flask run --cert=localhost.pem --key=localhost-key.pem