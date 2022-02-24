export function PrettifyDate(date: Date) {
	// just now
	// a few seconds ago
	// a minute ago
	// a couple of minutes ago
	// a few minutes ago
	// half an hour ago
	// an hour ago
	// a couple of hours ago
	// a few hours ago
	// yesterday
	// a couple of days ago
	// a few days ago
	// last week
	// a fortnight ago
	// last month
	// a couple of months ago
	// a few months ago
	// last year
	// a couple of years ago
	// a few years ago
	// a decade ago
	// a couple of decades ago
	// a few decades ago
	// a century ago
	// a couple of centuries ago
	// a few centuries ago
	// a millennium ago
	// a couple of millennia ago
	// a few millennia ago
	// a long time ago

	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const diffSeconds = Math.floor(diff / 1000);
	const diffMinutes = Math.floor(diff / 60000);
	const diffHours = Math.floor(diff / 3600000);
	const diffDays = Math.floor(diff / 86400000);
	const diffWeeks = Math.floor(diff / 604800000);
	const diffMonths = Math.floor(diff / 2628000000);
	const diffYears = Math.floor(diff / 31536000000);

	// just now
	if (diffSeconds < 3) {
		return 'just now';
	}
	// a few seconds ago
	if (diffSeconds < 4) {
		return diffSeconds + ' seconds ago';
	}
	// n seconds ago
	if (diffSeconds < 60) {
		return 'a minute ago';
	}
	// a minute ago
	if (diffMinutes < 2) {
		return 'a minute ago';
	}
	// a couple of minutes ago
	if (diffMinutes < 3) {
		return 'a couple of minutes ago';
	}
	// a few minutes ago
	if (diffMinutes < 4) {
		return 'a few minutes ago';
	}
	// half an hour ago
	if (28 < diffMinutes && diffMinutes < 32) {
		return 'half an hour ago';
	}
	// n minutes ago
	if (diffMinutes < 60) {
		return 'a couple of minutes ago';
	}
	// an hour ago
	if (diffHours < 2) {
		return 'an hour ago';
	}
	// a couple of hours ago
	if (diffHours < 3) {
		return 'a couple of hours ago';
	}
	// a few hours ago
	if (diffHours < 4) {
		return 'a few hours ago';
	}
	// n hours ago
	if (diffHours < 24) {
		return diffHours + ' hours ago';
	}
	// yesterday
	if (diffDays < 2) {
		return 'yesterday';
	}
	// a couple of days ago
	if (diffDays < 3) {
		return 'a couple of days ago';
	}
	// a few days ago
	if (diffDays < 4) {
		return 'a few days ago';
	}
	// n days ago
	if (diffDays < 7) {
		return diffDays + ' days ago';
	}
	// last week
	if (diffWeeks < 2) {
		return 'last week';
	}
	// a fortnight ago
	if (diffWeeks < 3) {
		return 'a fortnight ago';
	}
	// a few weeks ago
	if (diffWeeks < 4) {
		return 'a few weeks ago';
	}
	// a month ago
	if (diffMonths < 2) {
		return 'a month ago';
	}
	// a couple of months ago
	if (diffMonths < 3) {
		return 'a couple of months ago';
	}
	// a few months ago
	if (diffMonths < 4) {
		return 'a few months ago';
	}
	// a year ago
	if (diffYears < 2) {
		return 'a year ago';
	}
	// a couple of years ago
	if (diffYears < 3) {
		return 'a couple of years ago';
	}
	// a few years ago
	if (diffYears < 4) {
		return 'a few years ago';
	}
	// a decade ago
	if (diffYears < 12) {
		return 'a decade ago';
	}
	// a couple of decades ago
	if (diffYears < 24) {
		return 'a couple of decades ago';
	}
	// a few decades ago
	if (diffYears < 36) {
		return 'a few decades ago';
	}
	// a century ago
	if (diffYears < 200) {
		return 'a century ago';
	}
	// a couple of centuries ago
	if (diffYears < 300) {
		return 'a couple of centuries ago';
	}
	// a few centuries ago
	if (diffYears < 400) {
		return 'a few centuries ago';
	}
	// a millennium ago
	if (diffYears < 2000) {
		return 'a millennium ago';
	}
	// a couple of millennia ago
	if (diffYears < 3000) {
		return 'a couple of millennia ago';
	}
	// a few millennia ago
	if (diffYears < 4000) {
		return 'a few millennia ago';
	}
	// a long time ago
	return 'a long time ago';
}
