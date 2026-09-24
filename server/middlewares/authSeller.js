import jwt from 'jsonwebtoken'

const authSeller = async(req,res,next)=>
{
    const {sellerToken}= req.cookies;
    if(!sellerToken)
    {
        return res.json(
            {
                success:false,
                message:"Not Authorised"
            }
        );
    }

     try {
            const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
            if (tokenDecode.email=== process.env.SELLER_EMAIL) {
                next() ;  // <-- attach to req, not req.body
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Not Authorized"
                });
            }
            
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }


}
export default authSeller;