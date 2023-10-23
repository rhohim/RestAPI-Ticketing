from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/xendit-payment-callback', methods=['POST'])
def handle_payment_callback():
    # Process the payment callback data
    payment_data = request.json  # This contains the payment callback payload
    # Handle the payment data, update your database, send notifications, etc.

    print(payment_data.get('payment_detail'))
    
    # Send a 200 response to acknowledge receipt of the callback
    return jsonify({'message': 'Payment callback received'}), 200

@app.route('/') 
def index():
    
    return 'Welcome To the Club'

if __name__ == '__main__':
    app.run(debug=True,port=1818, host="0.0.0.0")