export function isFieldInvalid(fieldName, validationErrors) {
    return validationErrors.hasOwnProperty(fieldName);
}

export function getValidationErrorText(fieldName, validationErrors) {
    if (!validationErrors.hasOwnProperty(fieldName)) {
        return "";
    }

    let errorTexts = [];
    validationErrors[fieldName].map((item) => {
        errorTexts.push(item.error);
        return true;
    });

    return errorTexts.join(", ");
}

export function unsetValidationError(fieldName, validationErrors) {
    if (!validationErrors.hasOwnProperty(fieldName)) {
        return validationErrors;
    }

    delete validationErrors[fieldName];

    return validationErrors;
}