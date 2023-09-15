const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

export default function formateDate(date) {
  const elapsed = new Date(date) - new Date();

  // "Math.abs" accounts for both "past" & "future" scenarios
  const unit = Object.keys(units).find(
    (u) => Math.abs(elapsed) > units[u] || u === 'second'
  );

  return rtf.format(Math.round(elapsed / units[unit]), unit);
}
