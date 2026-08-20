// Strict Cameroon number: phone number begins with 6 and contains 9 digits in total
// Accepted : 6XXXXXXXX, 2376XXXXXXXX, +2376XXXXXXXX
export const CMR_PHONE_NUM = /^(\+?237)?6[0-9]{8}$/

export function normalizeCmrPhone(phone) {
    if (typeof phone !== "string") {
        throw new TypeError("Phone number must be a string")
    }

    const digits = phone.replace(/[^0-9]/g, "")
    if (!CMR_PHONE_NUM.test(digits)) {
        throw new Error("Invalid Cameroonian phone number")
    }

    return digits.startsWith("237") ? `+${digits}` : `+237${digits}`
}