export const FormatDate = (dateString) => {
    let newFormat2 = new Date(dateString);
    let newFormat3 = new Date(dateString).toISOString();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let getMonth = monthNames[newFormat2.getMonth()];
    let getDate = newFormat3.slice(8, 10);
    let getYear = newFormat2.getFullYear();
    return getDate + " " + getMonth + " " + getYear;
  };