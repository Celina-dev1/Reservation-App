export const isTuesday = (date) => {
    const resDate = new Date(date);

     if (resDate.getUTCDay() === 2) {
         return true;
     }
     return false;
};

export const dateInPast = (date) => {
    const today = new Date();
    const resDate = new Date(date);

    if (resDate.toLocaleDateString() >= today.toLocaleDateString()) {
        return false;
    }
    return true;
};

export const invalidTime = (date, time) => {
    const res = new Date(`${date} ${time}`);

    if (res.getHours() < 10 || (res.getHours() === 10 && res.getMinutes() < 30)) {
            return true;
    }
    else if (res.getHours() > 21 || (res.getHours() === 21 && res.getMinutes() > 30)) {
        return true;
    }
        return false;
}