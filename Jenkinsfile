pipeline {
  agent {
    label 'ubuntu'
  }
  stages {
    stage('instalar awscli') {
      steps {
        tool 'ubuntu-common-tools'
      }
    }
    stage('traer cosas y buildear') {
      parallel {
        stage('buildear!') {
          steps {
            sh 'sudo docker pull postack/node-builder'
            sh 'sudo docker run -i -v=$(pwd):/tmp/project postack/node-builder:latest /bin/sh -c "cd /tmp/project && npm install && npm test"'
          }
        }
      }
      post {
        always {
          sh 'sudo docker run -i -v=$(pwd):/tmp/project postack/node-builder:latest /bin/sh -c "cd /tmp/project && rm -Rf node_modules"'

        }

      }
    }
    
  }
  post {
    always {
      sh 'sudo docker run -i -v=$(pwd):/tmp/project postack/node-builder:latest /bin/sh -c "cd /tmp/project && chmod 777 -R /tmp/project && rm -Rf /tmp/project/lib && rm -Rf node_modules/"'

    }

  }
}