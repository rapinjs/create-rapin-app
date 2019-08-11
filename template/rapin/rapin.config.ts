const path = require('path')
module.exports = {
  <%_ if (typeorm) {_%>
  //Database access
  db: {
    type: '<%= dbType%>',
    <%_ if (dbType === 'mongodb') { _%>
    useNewUrlParser: true,
    url: '<%= dbUrl %>'',
    ssl: true,
    authSource: '<%= dbAuthSource %>',
    replicaSet: '<%= dbReplicaSet %>',
    <%_ } _%>
    <%_ if (dbType === 'mysql') { _%>
    database: '<%= dbName %>',
    hostname: '<%= dbHostname %>',
    password: '<%= dbPassword %>',
    username: '<%= dbUsername %>',
    port: '<%= dbPort %>',
    <%_ } _%>
  },
  <%_ } _%>
  //Style setting
  style: {
    engine: '<%= stylesheet %>'
  },
  //Template setting
  template: {
    engine: '<%= template %>'
  },
  //Setting cache system
  cache: {
    engine: 'file',
    expire: 3600
  },
  //Setting logs
  log: {
    filename: 'error.log'
  },
  <%_ if(mail) {_%>
  //Access to mail
  mail: {
    service: '<%= mailService %>',
    user: '<%= mailUser %>',
    password: '<%= mailPassword %>'
  },
  <%_ } else { _%>
    //Access to mail
  mail: {
    service: '',
    user: '',
    password: ''
  },
  <%_ } _%>
  //List plugins
  plugins: ['plugins/testPlugin.ts', <%_ if (typeorm) { _%> '@rapin/typeorm', <%_ } _%> <%_ if(typeorm && auth) { _%> '@rapin/typeorm-auth',<%_ } _%> <%_ if (inky) { _%> "@rapin/inky" <%_ } _%>]
}
