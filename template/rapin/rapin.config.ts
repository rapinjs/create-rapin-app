const path = require('path')
module.exports = {
  <%_ if (db) {_%>
  //Database access
  db: {
    <%_ if (dbType === 'mongodb') { _%>
    url: '<%= dbUrl %>'
    <%_ } _%>
    <%_ if (dbType === 'sql') { _%>
    type: 'my<%= dbType%>',
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
  plugins: ['plugins/testPlugin.ts', <%_ if (db && dbType === 'sql') { _%> '@rapin/typeorm', <%_ } _%> <%_ if (db && dbType === 'mongodb') { _%> '@rapin/mongoose', <%_ } _%> <%_ if(db && dbType === 'sql' && auth) { _%> '@rapin/typeorm-auth',<%_ } _%> <%_ if (inky) { _%> "@rapin/inky" <%_ } _%>]
}
