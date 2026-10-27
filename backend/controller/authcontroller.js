export async function authCheak(req,res,next) {
    if(!req.user){
        res.status(400).json({message:"Unauthroized"})
    }
    res.status(200).json(req.user)

}


