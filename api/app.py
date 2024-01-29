import json

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, func

# Creating Flask app
app = Flask(__name__)

# Creating SQLAlchemy instance
db = SQLAlchemy()

user = "root"
pin = "1234"
host = "localhost"
db_name = "it_asset_db"

# Configuring database URI
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{user}:{pin}@{host}/{db_name}"

# Disable modification tracking
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


class Serializer(object):

    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]


# Creating Models
class ItAsset(db.Model, Serializer):
    __tablename__ = "ItAsset"

    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(500), nullable=False)
    serialNumber = db.Column(db.String(500), nullable=False)
    warrantyExpirationDate = db.Column(db.String(500), nullable=False)
    status = db.Column(db.String(500), nullable=False)
    createdDate = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def serialize(self):
        d = Serializer.serialize(self)
        d['createdDate'] = self.createdDate.strftime('%Y-%m-%d %H:%M:%S')
        return d


def create_db():
    db.init_app(app)
    with app.app_context():
        db.create_all()


@app.route("/")
def getAllAssets():
    details = ItAsset.query.all()
    response = app.response_class(
        response=json.dumps(ItAsset.serialize_list(details)),
        status=200,
        mimetype='application/json'
    )
    return response


# Add data route
@app.route("/add", methods=['GET', 'POST'])
def addAsset():
    if request.method == 'POST':
        reqJson = request.get_json(force=True)

        brand = reqJson['brand']
        serialNumber = reqJson['serialNumber']
        warrantyExpirationDate = reqJson['warrantyExpirationDate']
        status = reqJson['status']

        add_detail = ItAsset(
            brand=brand,
            serialNumber=serialNumber,
            warrantyExpirationDate=warrantyExpirationDate,
            status=status
        )
        db.session.add(add_detail)
        db.session.commit()
        return jsonify({"message": "Data added successfully"})

    return jsonify({"message": "Invalid request method. Expecting a POST request."})


# Edit data route
@app.route("/edit", methods=['GET', 'POST'])
def editAsset():
    if request.method == 'POST':
        reqJson = request.get_json(force=True)
        asset = ItAsset.query.get_or_404(reqJson['id'])
        asset.brand = reqJson['brand']
        asset.serialNumber = reqJson['serialNumber']
        asset.warrantyExpirationDate = reqJson['warrantyExpirationDate']
        asset.status = reqJson['status']

        db.session.add(asset)
        db.session.commit()
        return jsonify({"message": "Data edited successfully"})

    return jsonify({"message": "Invalid request method. Expecting a POST request."})


# Edit data route
@app.route("/delete", methods=['GET', 'POST'])
def deleteAsset():
    if request.method == 'POST':
        reqJson = request.get_json(force=True)
        asset = ItAsset.query.get_or_404(reqJson['id'])

        db.session.delete(asset)
        db.session.commit()
        return jsonify({"message": "Data deleted successfully"})

    return jsonify({"message": "Invalid request method. Expecting a POST request."})


if __name__ == "__main__":
    create_db()
    app.run(debug=True)
