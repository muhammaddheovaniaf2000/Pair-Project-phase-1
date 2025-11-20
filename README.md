# Pair-Project-phase-1
<!-- ! COMMAND MODEL -->

npx sequelize-cli model:create --name User --attributes email:string,password:string,role:string

npx sequelize-cli model:create --name UserProfile --attributes name:string,profilePict:string,UserId:integer

npx sequelize-cli model:create --name Post --attributes posting:string,caption:string,like:integer

npx sequelize-cli model:create --name PostTag --attributes PostId:integer,TagId:integer

npx sequelize-cli model:create --name Tag --attributes hastag_name:string

npx sequelize-cli migration:create --name Add-UserId-Posts

