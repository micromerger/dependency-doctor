# dependency-doctor

###### dependency-doctor is npm package used to find deprecated packages and send warning through email periodically

Usage of dependency-doctor is simple

#### Step 1

Use following command to create the config file
`npx dependency-doctor --init`

#### Step 2

Edit the checkdep.json file and fill all the values

#### Step 3

Use the following commmand to start the process
Note: You need to be in the same directory where checkdep.json file exists
`npx dependency-doctor --start`
With this above command, dependency-doctor will read all the dependencies
and gather information about all the dependencies and send them to the provided emails, using nodemailer.

dependency-doctor uses node-cron to send the emails periodically to the user
