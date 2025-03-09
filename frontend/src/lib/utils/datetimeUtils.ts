export const getDateTime = (date: string, time?: string) => {
  if (!time) {
    time = "00:00";
  }
  if (date && time) {
    const [year, month, day] = date.split("-");
    const [hours, minutes] = time.split(":");
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
  }
  return null;
};

export const timeLeftUntil = (timestamp: string): string => {
  const now = new Date();
  const targetTime = new Date(timestamp);
  const timeDifference = targetTime.getTime() - now.getTime();
  if (timeDifference < 0) {
    return "Deadline ended";
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  let response = "";
  if (days > 0) {
    response += `${days} days`;
    if (hours > 0) response += `, ${hours} hours`;
    return response;
  }
  if (hours > 0) {
    response += `${hours} hours, ${minutes} minutes`;
    return response;
  }
  if (minutes > 0) {
    response += `${minutes} minutes, ${seconds} seconds`;
    return response;
  }
  response += `${seconds} seconds`;
  response += " left"
  return response;
};
