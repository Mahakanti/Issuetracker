const { ObjectId } = require('mongodb');// This is a function from the mongodb library that helps work with MongoDB's unique document identifiers.
const mongoDB = require('../database/mongodb')//import mongodb module

function filterBy(filter, projectDetails) {// It's designed to filter an array of project details based on a given filter (like 'Title', 'Description', or 'Author'). The function sorts array based on the chosen filter in alphabetical order.
    switch (filter) {
        case 'Title'://It checks if the filter parameter is equal to the string 'Title'. If it is, the code inside this case block will be executed.
            for (let check = 0; check < projectDetails.length; ++check) {
                for (let index = 0; index < projectDetails.length - 1; ++index) {
                    let temp = null;
                    if (projectDetails[index].projectName > projectDetails[index + 1].projectName) {//This line checks if the projectName property of the project detail at the current index is greater (in lexicographical order) than the projectName property of the next project detail in the array.
                        // Just swap them
                        temp = projectDetails[index];
                        projectDetails[index] = projectDetails[index + 1];
                        projectDetails[index + 1] = temp;
                    }
                }
            }
            return projectDetails;

        case 'Description':// if filter==description
            for (let check = 0; check < projectDetails.length; ++check) {
                for (let index = 0; index < projectDetails.length - 1; ++index) {
                    let temp = null;
                    if (projectDetails[index].description > projectDetails[index + 1].description) {
                        temp = projectDetails[index];
                        projectDetails[index] = projectDetails[index + 1];
                        projectDetails[index + 1] = temp;
                    }
                }
            }
            return projectDetails;

        case 'Author'://filter==author
            for (let check = 0; check < projectDetails.length; ++check) {
                for (let index = 0; index < projectDetails.length - 1; ++index) {
                    let temp = null;
                    if (projectDetails[index].authorName > projectDetails[index + 1].authorName) {
                        temp = projectDetails[index];
                        projectDetails[index] = projectDetails[index + 1];
                        projectDetails[index + 1] = temp;
                    }
                }
            }
            return projectDetails;

        default://when the filter parameter doesn't match any of the specified cases it does nothing
            break;
    }

}

module.exports.issueTrackerPage = async (req, res) => {
    const collection = await mongoDB();
    const addedProject = await collection.find({ id: 'addedProject' }).toArray();
    // it's looking for documents where id is 'addedProject' in database collection.
    // converts the result of the .find() query into an array of JavaScript objects representing the documents.

    return res.render('issueTracker', {
     // render an HTML view template named 'issueTracker'.  

        title: "Issue Tracker",//It sets a variable named title in the view template with the value "Issue Tracker". 
        addedProject//contains the data retrieved from the MongoDB database earlier.
    })
}

module.exports.createProject = (req, res) => {
    return res.render('createProject', {
        title: "Create Project"
    })
}

module.exports.addProjectToMongoDB = async (req, res) => {
    let formData = req.body;
    formData = { ...formData, id: "addedProject" }
    const collection = await mongoDB();
    collection.insertOne(formData, (err, data) => {
        if (err)
            throw err
        else if (data)
            console.log('data inserted')
            alert("project summited!");
    });
    res.redirect('/issueTracker')
}

module.exports.projectDetails = async (req, res) => {
    const collection = await mongoDB();
    let projectDetails = await collection.find({ id: 'addedProject' }).toArray();
    return res.render('projectDetails', {
        title: "Project Details",
        projectDetails
    })
}

module.exports.filterProjectDetails = async (req, res) => {
    const collection = await mongoDB();
    let projectDetails = await collection.find({ id: 'addedProject' }).toArray();
    const filterReq = req.body;// extracts the data sent in the HTTP POST request's body and stores it in a variable 

    if (filterReq.formFilter === 'Project Title') {//checks if the flexRadio property of filterReq is equal to the string 'Project Title'.
        const filteredProjectDetails = filterBy('Title', projectDetails)
        return res.render('projectDetails', { title: "Project Details", projectDetails: filteredProjectDetails })
    }
    else if (filterReq.formFilter === 'Project Description') {
        const filteredProjectDetails = filterBy('Description', projectDetails)
        return res.render('projectDetails', { title: "Project Details", projectDetails: filteredProjectDetails })
    }
    else if (filterReq.formFilter === 'Project Author') {
        const filteredProjectDetails = filterBy('Author', projectDetails)
        return res.render('projectDetails', { title: "Project Details", projectDetails: filteredProjectDetails })
    }
}

module.exports.createAnIssue = async (req, res) => {
    const issueId = req.params;
    return res.render('createIssue', { title: "Create Issue", issueId })
}

module.exports.addAnIssue = async (req, res) => {
    //find a document with a specific _id (issue ID) and pushes the issue data into an array field named bugs.
   
    const issue = req.body;
    const bugId = req.params.id;
    const collection = await mongoDB();
    await collection.findOneAndUpdate({ _id:new ObjectId(bugId) }, { '$push': { bugs: issue } });
    res.redirect('/issueTracker/projectDetails')
    // redirects the user to the '/issueTracker/projectDetails' route after the issue has been added to the database
}