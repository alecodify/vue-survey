import jsonwebtoken from 'jsonwebtoken';

const jwtManager = (user) => {
    const accessToken = jsonwebtoken.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '2d'});
    return accessToken;
}

export default jwtManager;