const formatDate = date => {
    // console.log(typeof date); object
    /* const formatedDate = date.toString().split('G')[0].toString().trim();
    return formatedDate; */
    const formatedDate = new Date(date).toISOString();
    // console.log(new Date(date).toISOString());
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
    };
    return new Date(formatedDate).toLocaleDateString('en-US', options);
};

export default formatDate;