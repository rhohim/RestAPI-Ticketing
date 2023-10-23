function generateRandomTicketCode() {
    const result = Math.random().toString(36).substring(2,10);
    return result;
}

module.exports = generateRandomTicketCode