from setup import app, db, DateTime, datetime, format_date, request, jsonify
from user import User

class Reservation(db.Model):
    __tablename__ = "reservation"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    destination_id = db.Column(db.String(20))
    user_id = db.Column(db.String(20))
    reservation_date = db.Column(DateTime, default=datetime.utcnow)
    start_date = db.Column(DateTime, default=datetime.utcnow)
    end_date = db.Column(DateTime, default=datetime.utcnow)
    total_price = db.Column(db.Integer)
    nr_spots = db.Column(db.Integer)

    def __init__(self, destination_id, user_id, reservation_date, start_date, end_date, total_price, nr_spots):
        self.destination_id = destination_id
        self.user_id = user_id
        self.reservation_date = reservation_date
        self.start_date = start_date
        self.end_date = end_date
        self.total_price = total_price
        self.nr_spots = nr_spots

    def to_json(self):
        return {"id": self.id, "destination_id": self.destination_id, "user_id": self.user_id,
                "reservation_date": format_date(self.reservation_date), "start_date": format_date(self.start_date),
                "end_date": format_date(self.end_date),
                "total_price": self.total_price, "nr_spots": self.nr_spots}

    def to_json_with_name(self, name):
        return {"id": self.id, "destination_id": self.destination_id, "user_id": name,
                "reservation_date": format_date(self.reservation_date), "start_date": format_date(self.start_date),
                "end_date": format_date(self.end_date),
                "total_price": self.total_price, "nr_spots": self.nr_spots}

    def __str__(self):
        return str(self.to_json())


@app.route('/reservation/get_all', methods=['GET'])
def get_all_reservation():
    reservations = Reservation.query.all()
    for reservation in reservations:
        reservation.user_id = get_user_name_by_user_id(reservation.user_id)
        print(reservation.user_id)

    return jsonify([res.to_json_with_name(res.user_id) for res in reservations])


def get_user_name_by_user_id(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user:
        return user.name
    else:
        return jsonify({"error": "User not found"}), 404


@app.route('/reservation/get_by_destination_id/<string:destination_id>', methods=['GET'])
def get_reservation_by_destination_id(destination_id):
    reservations = Reservation.query.filter_by(destination_id=destination_id).all()

    for reservation in reservations:
        reservation.user_id = get_user_name_by_user_id(reservation.user_id)
        print(reservation.user_id)
    return jsonify([res.to_json_with_name(res.user_id) for res in reservations])


@app.route('/reservation/add', methods=['POST'])
def add_reservation():
    user_id = request.json.get("user_id")
    destination_id = request.json.get("destination_id")
    total_price = request.json.get("total_price")
    nr_spots = request.json.get("nr_spots")

    # New fields: start_date and end_date
    start_date_str = request.json.get("start_date")
    end_date_str = request.json.get("end_date")
    reservation_date_str = request.json.get("reservation_date")

    start_date = datetime.strptime(start_date_str, "%m/%d/%Y")
    end_date = datetime.strptime(end_date_str, "%m/%d/%Y")
    reservation_date = datetime.strptime(reservation_date_str, "%m/%d/%Y")

    reservation = Reservation(destination_id=destination_id, user_id=user_id, reservation_date=reservation_date,
                              start_date=start_date, end_date=end_date,
                              total_price=total_price, nr_spots=nr_spots)

    db.session.add(reservation)
    db.session.commit()
    return jsonify({"message": "Reservation added successfully"}), 201


