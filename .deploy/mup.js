module.exports = {
    servers: {
        one: {
            host: "52.79.111.161",
            username: 'ubuntu',
            pem: "../../tyherox.pem"
            // pem:
            // password:
            // or leave blank for authenticate from ssh-agent
        }
    },
    meteor: {
        name: 'vread',
        path:"../",
        servers: {
            one: {}
        },
        buildOptions: {
            debug: false,
            serverOnly: true,
        },
        env: {
            ROOT_URL: "http://ec2-52-79-111-161.ap-northeast-2.compute.amazonaws.com"
        },
        dockerImage: 'abernix/meteord:node-8.4.0-base',
        deployCheckWaitTime: 60
    },
    mongo: {
        oplog: true,
        port: 27017,
        servers: {
            one: {},
        },
    },
};
