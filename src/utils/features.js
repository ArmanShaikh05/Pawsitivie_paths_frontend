import moment from "moment";

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  });
};

const getCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const getNumberFromCurrency = (formattedCurrency) => {
  const numericString = formattedCurrency.replace(/[^0-9.-]+/g, "");
  return parseFloat(numericString);
};

const getTotalPrice = (cartData) => {
  let totalPrice = 0;
  cartData.map((item) => {
    totalPrice += item.productId.productPrice * item.quantity;
  });
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(totalPrice);
};

const getShippingPrice = (cartData) => {
  let totalPrice = 0;
  cartData.map((item) => {
    totalPrice += item.productId.productPrice * item.quantity;
  });
  if (totalPrice > 5000) {
    return "Free";
  } else if (totalPrice === 0) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(0);
  } else {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(200);
  }
};

const getTaxPrice = (cartData) => {
  let totalPrice = 0;
  cartData.map((item) => {
    totalPrice += item.productId.productPrice * item.quantity;
  });
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(totalPrice * 0.28);
};

const getGrandTotalPrice = (cartData, discount) => {
  let totalPrice = 0;
  let shippingPrice = 0;

  cartData.map((item) => {
    totalPrice += item.productId.productPrice * item.quantity;
  });

  if (totalPrice > 5000) {
    shippingPrice = 0;
  } else if (totalPrice === 0) {
    shippingPrice = 0;
  } else {
    shippingPrice = 200;
  }

  let taxPrice = totalPrice * 0.28;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(totalPrice + shippingPrice + taxPrice - discount);
};

const getTotalItems = (products) => {
  let totalItem = 0;
  products.map((item) => (totalItem += item.productQty));
  return totalItem;
};

const generateTimeSlots = (startTime, endTime) => {
  const slots = [];

  // Convert "HH:mm" time format to total minutes
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Convert startTime and endTime to minutes
  let currentTime = timeToMinutes(startTime);
  const endTimeInMinutes = timeToMinutes(endTime);

  // Generate slots in 30-minute intervals
  while (currentTime <= endTimeInMinutes) {
    const hour = String(Math.floor(currentTime / 60)).padStart(2, "0");
    const minute = String(currentTime % 60).padStart(2, "0");
    slots.push(`${hour}:${minute}`);

    // Increment by 30 minutes
    currentTime += 30;
  }

  return slots;
};

function addOneHourToTime(startTime) {
  // Parse the startTime into hours and minutes
  const [hours, minutes] = startTime.split(":").map((num) => parseInt(num, 10));

  // Create a new Date object starting at today's date, with the given start time
  const startDate = new Date();
  startDate.setHours(hours);
  startDate.setMinutes(minutes);
  startDate.setSeconds(0); // Optional: to reset seconds to 0

  // Add 1 hour to the start date
  startDate.setHours(startDate.getHours() + 1);

  // Format the end time as "HH:mm"
  const endTime = startDate.toTimeString().slice(0, 5); // Get the first 5 characters (HH:mm)

  return endTime;
}

const arrangeArrayByDate = (array) => {
  const uniqueDates = [
    ...new Set(array.map((element) => moment(element.createdAt).format("LL"))),
  ];
  return uniqueDates.sort(
    (a, b) => moment(b, "LL").toDate() - moment(a, "LL").toDate()
  );
};

const formatDate = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (moment(date).format("LL") === moment(today).format("LL")) return "Today";
  if (moment(date).format("LL") === moment(yesterday).format("LL"))
    return "Yesterday";
  return moment(date).format("LL");
};

const getCoordinatesFromAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      return { error: "No location found" };
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

function convertAmount(amount) {
  if (amount === 0) return 0; // If already 0, return 0

  // Remove currency symbol and commas, then convert to number
  const numericValue = parseFloat(amount.replace(/[^0-9.]/g, ""));

  return isNaN(numericValue) ? 0 : numericValue;
}

export {
  convertToBase64,
  getCurrency,
  getTotalPrice,
  getShippingPrice,
  getTaxPrice,
  getNumberFromCurrency,
  getGrandTotalPrice,
  getTotalItems,
  generateTimeSlots,
  addOneHourToTime,
  arrangeArrayByDate,
  formatDate,
  getCoordinatesFromAddress,
  convertAmount,
};
