import jsonwebtoken from 'jsonwebtoken';

const jwtManager = (user) => {
    const payload = {
        id: user._id,
        isAdmin: user.isAdmin || false 
    };
    const accessToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {expiresIn: '2d'});
    return accessToken;
}

export default jwtManager;