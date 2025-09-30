// to add new application 

const applications = require("./model/applicationModel");

exports.addApplicationsController = async(req,res)=>{
    const {jobtitle ,  fullname , qualification , email , phone , coverletter } = req.body
    const resume = req.file.filename
    console.log(resume);
    

    console.log(jobtitle , fullname , qualification , email , phone , coverletter );
    
    try{
        const existingApplication = await applications.findOne({jobtitle , email})
        if(existingApplication){
            res.status(406).json('already applied')
        }
        else{
            const newApplication = new applications({
                jobtitle , name:fullname , qualification , email , phone , coverletter:coverletter , resume
            })
            await newApplication.save()
            res.status(200).json(newApplication)
        }

    }catch(error){
        res.status(200).json(error)
    }
}

// to get all aplication
exports.getAllApplicationController = async(req,res)=>{
    try{
        const allApplications = await applications.find()
        res.status(200).json(allApplications)

    }catch(error){
        res.status(500).json(error)
    }
}