pipeline {
    agent any
    
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/ottomann1/slowchat.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('slowchatimg:latest')  // Ensure the image is tagged
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image('slowchatimg:latest').push('latest')  // Push the latest tag
                    }
                }
            }
        }
    }
}
