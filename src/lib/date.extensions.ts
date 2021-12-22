interface Date {
	prettify(): string;
}

Date.prototype.prettify = function () {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const difference = new Date(new Date() - this);
	const days = difference.getDate() - 1;
	const hours = difference.getHours();
	const minutes = difference.getMinutes();
	if (days !== 0) return days + ` day${days !== 1 ? 's' : ''} ago`;
	if (hours !== 0) return hours + ` hour${hours !== 1 ? 's' : ''} ago`;
	if (minutes !== 0) return days + ` minute${minutes !== 1 ? 's' : ''} ago`;
	return 'just now';
};
