
const generateSignature = () => {
    const SECRET = 'sk_test_Lalamove'; 
    const time = new Date().getTime().toString(); // => `1545880607433`
    
    const method = 'POST';
    const path = '/v3/quotations';
    const body = JSON.stringify({}); // => the whole body for '/v3/quotations'
    
    const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n${body}`;
    //const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n`; if the method is GET
    // => '1546222219293\r\nPOST\r\n/v3/quotations\r\n\r\n{\n"data":{...}'
    
    
    const SIGNATURE = CryptoJS.HmacSHA256(rawSignature, SECRET).toString();
}

export { generateSignature }