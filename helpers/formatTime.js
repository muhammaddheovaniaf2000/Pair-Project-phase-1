const { formatDistanceToNow } = require('date-fns');

function formatTime(date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

module.exports = formatTime;