from setup import db, datetime, DateTime, jsonify, base64, json, request, app, format_date

class Destination(db.Model):
    __tablename__ = "destination"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    location = db.Column(db.String(100))
    price = db.Column(db.Integer)
    available_spots = db.Column(db.Integer)
    description = db.Column(db.String(100))
    discount = db.Column(db.Integer)
    image_data = db.Column(db.LargeBinary(100))
    image_name = db.Column(db.String(100))
    start_date = db.Column(DateTime, default=datetime.utcnow)
    end_date = db.Column(DateTime, default=datetime.utcnow)

    def __init__(self, title, location, price, available_spots, description, discount, image_data, image_name,
                 start_date, end_date):
        self.title = title
        self.location = location
        self.price = price
        self.available_spots = available_spots
        self.description = description
        self.discount = discount
        self.image_data = image_data
        self.image_name = image_name
        self.start_date = start_date
        self.end_date = end_date

    def to_json(self):
        image_data = decode_image(self.image_data)
        return {"id": self.id, "title": self.title, "location": self.location, "price": self.price,
                "available_spots": self.available_spots, "description": self.description, "discount": self.discount,
                "image_data": image_data, "image_name": self.image_name, "start_date": format_date(self.start_date),
                "end_date": format_date(self.end_date)}

    def __str__(self):
        return str(self.to_json())


def decode_image(image_data):
    if isinstance(image_data, bytes):
        return image_data.decode('utf-8')

@app.route('/destination/get_all', methods=['GET'])
def get_all_destinations():
    destinations = Destination.query.all()
    return jsonify([dest.to_json() for dest in destinations])


@app.route('/destination/add', methods=['POST'])
def add_destination():
    destination_data = json.loads(dict(request.form)['destination'])
    destination_image = request.files['image']

    title = destination_data.get("title")
    location = destination_data.get("location")
    price = destination_data.get("price")
    available_spots = destination_data.get("available_spots")
    description = destination_data.get("description")
    discount = destination_data.get("discount")
    image_name = destination_image.filename

    image = destination_image.read()
    image_data = base64.b64encode(image)

    # New fields: start_date and end_date
    start_date_str = destination_data.get("start_date")
    end_date_str = destination_data.get("end_date")

    start_date = datetime.strptime(start_date_str, "%m/%d/%Y")
    end_date = datetime.strptime(end_date_str, "%m/%d/%Y")

    destination = Destination(title=title, location=location, price=price, available_spots=available_spots,
                              description=description, discount=discount, image_data=image_data, image_name=image_name,
                              start_date=start_date, end_date=end_date)

    db.session.add(destination)
    db.session.commit()
    return jsonify({"message": "Destination added successfully"}), 201


@app.route('/destination/update/<int:destination_id>', methods=['PUT'])
def update_destination(destination_id):
    destination = Destination.query.get(destination_id)

    if not destination:
        return jsonify({"error": "Could not update destination"}), 400

    destination_data = json.loads(dict(request.form)['destination'])
    destination_image = request.files['image']

    destination.title = destination_data.get("title")
    destination.location = destination_data.get("location")
    destination.price = destination_data.get("price")
    destination.available_spots = destination_data.get("available_spots")
    destination.description = destination_data.get("description")
    destination.discount = destination_data.get("discount")
    destination.image_name = destination_image.filename

    start_date_str = destination_data.get("start_date")
    end_date_str = destination_data.get("end_date")
    start_date = datetime.strptime(start_date_str, "%m/%d/%Y")
    end_date = datetime.strptime(end_date_str, "%m/%d/%Y")

    # Set the start_date and end_date attributes with date part only
    destination.start_date = start_date.date()
    destination.end_date = end_date.date()

    print(start_date)

    image = destination_image.read()
    image_data = base64.b64encode(image)

    destination.image_data = image_data

    db.session.commit()

    # Convert dates to string with "DD/MM/YYYY" format
    start_date_str_formatted = start_date.strftime("%d/%m/%Y")
    end_date_str_formatted = end_date.strftime("%d/%m/%Y")

    print(start_date_str_formatted)

    return jsonify({
        "message": "Destination updated successfully!",
        "start_date": start_date_str_formatted,
        "end_date": end_date_str_formatted
    }), 200


@app.route('/destination/delete/<int:destination_id>', methods=['DELETE'])
def delete_destination(destination_id):
    destinations = Destination.query.all()

    for destination in destinations:
        if destination.id == destination_id:
            db.session.delete(destination)
            db.session.commit()

            return jsonify({"message": f"Destination removed successfully! {destinations}"}), 200

    return jsonify({"error": "Could not remove destination"}), 400


@app.route('/destination/consume_spots/<int:destination_id>/<int:nr_spots>', methods=["POST"])
def consume_spots(destination_id, nr_spots):
    try:

        destination = Destination.query.get(destination_id)
        destination.available_spots -= int(nr_spots)
        db.session.commit()
        return jsonify({"message": "Success"}), 200
    except:
        return jsonify({"message": "Failed"}), 400

