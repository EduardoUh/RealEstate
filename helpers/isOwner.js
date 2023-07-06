const isOwner = (userId, propertyUserId) => {
    return userId === propertyUserId;
};

export {
    isOwner,
};
