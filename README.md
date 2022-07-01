# dependency-doctor

###### dependency-doctor is npm package used to find deprecated packages and send warning through email periodically

Usage of dependency-doctor is simple

#### Step 1

Use following command to create the config file
`npx dependency-doctor --init`

#### Step 2

Edit the doctor.config.json file and fill all the values

#### Step 3

Use the following commmand to start the process


`npx dependency-doctor --start`

Note: You need to be in the same directory where doctor.config.json file exists

dependency-doctor will generate a report and send it to the provided emails, using nodemailer.

