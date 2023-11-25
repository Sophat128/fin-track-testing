pipeline {
    // agent {
    //     label 'jk-worker1'
    // }
    agent any
    tools {
        nodejs 'nodejs'
    }
    environment {
        DOCKER_REGISTRY = 'kimheang68'
        IMAGE_NAME = 'fintrack-ui-testing'
        CONTAINER_NAME = 'angular-fintrack-testing-container'
        TELEGRAM_BOT_TOKEN = credentials('telegram-token')
        TELEGRAM_CHAT_ID = credentials('chat-id')
        BUILD_INFO = "${currentBuild.number}"
        COMMITTER = sh(script: 'git log -1 --pretty=format:%an', returnStdout: true).trim()
        BRANCH = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
        // SONARQUBE_TOKEN = credentials('sonarqube-token')
    }

    stages {
        stage('Notify Start') {
            steps {
                script {
                     echo "Testing Notifications !!!!"
                     echo "Hello Notifications !!!!"
                    sendTelegramMessage("🚀 Pipeline Started:\nJob Name: ${env.JOB_NAME}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                }
            }
        }
        



        stage('Build') {
            steps {
                script {
                    try {
                        sh 'npm install --force'
                        sh 'npm run build'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        def errorMessage = "❌ Build stage <b> failed </b>:\n${e.getMessage()}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}\nConsole Output: ${env.BUILD_URL}console"
                        sendTelegramMessage(errorMessage)
                        error(errorMessage)
                    }
                }
            }
        }
    
        stage('Test') {
            steps {
                script {
                    try {
                        // sh 'npm run test'
                        echo "Test coding 1"
                        sh "echo IMAGE_NAME is ${env.IMAGE_NAME}"
                        // sendTelegramMessage("✅ Test stage succeeded\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Test stage <b> failed </b>: ${e.message}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        error("Test stage failed: ${e.message}")
                    }
                }
            }
        }
        stage('Check for Existing Container') {
            steps {
                script {
                    try {
                        def containerId = sh(script: "docker ps -a --filter name=${env.CONTAINER_NAME} -q", returnStdout: true).trim()
                        sh "echo containerId is ${containerId}" 
                        if (containerId) {
                            sh "docker stop ${containerId}"
                            sh "docker rm ${containerId}"
                            // sendTelegramMessage("✅ Container cleanup succeeded\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        } else {
                            // sendTelegramMessage("✅ No existing container to remove\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        }
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Check for Existing Container stage failed: ${e.message}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        error("Check for Existing Container stage failed: ${e.message}")
                    }
                }
            }
        }
        stage('Build Image') {
            steps {
                script {
                    try {
                        def buildNumber = currentBuild.number
                        def imageTag = "${IMAGE_NAME}:${buildNumber}"
                        sh "docker build -t ${DOCKER_REGISTRY}/${imageTag} ."

                        withCredentials([usernamePassword(credentialsId: 'docker-hub-cred',
                                passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                            sh "echo \$PASS | docker login -u \$USER --password-stdin"
                            sh "docker push ${DOCKER_REGISTRY}/${imageTag}"
                            // sendTelegramMessage("✅ Build Image stage succeeded\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        }
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Build Image stage failed: ${e.message}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        error("Build Image stage failed: ${e.message}")
                    }
                }
            }
        }

        stage('Trigger ManifestUpdate') {
            steps {
                script {
                    try {
                        build job: 'fintrack-ui-testing-pipeline-2', parameters: [string(name: 'DOCKERTAG', value: env.BUILD_NUMBER)]
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Trigger ManifestUpdate stage failed: ${e.message}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        error("Trigger ManifestUpdate stage failed: ${e.message}")
                    }
                }
            }
        }

    }

    post {
        success {
            sendTelegramMessage("✅ All stages succeeded\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
            // emailext body: "<html><body><b>✅ All stages succeeded</b><br/>Version: ${BUILD_INFO}<br/>Committer: ${COMMITTER}<br/>Branch: ${BRANCH}<br/>Check console output at <a href='${BUILD_URL}'>${BUILD_URL}</a> to view the results.</body></html>",
            //     subject: "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
            //     to: "yan.sovanseyha@gmail.com, kimheangken68@gmail.com,",
            //     mimeType: 'text/html'
        }
        // failure {
        //     emailext body: "<html><body><b>❌ Pipeline failed</b><br/>Version: ${BUILD_INFO}<br/>Committer: ${COMMITTER}<br/>Branch: ${BRANCH}<br/>Check console output at <a href='${BUILD_URL}'>${BUILD_URL}</a> to view the results.</body></html>",
        //         subject: "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
        //         to: "yan.sovanseyha@gmail.com, kimheangken68@gmail.com",
        //         mimeType: 'text/html'
        // }
    }
}

def sendTelegramMessage(message) {
    script {
        sh """
            curl -s -X POST https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/sendMessage -d chat_id=\${TELEGRAM_CHAT_ID} -d parse_mode="HTML" -d text="${message}"
        """
    }
}