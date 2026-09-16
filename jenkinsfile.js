pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-1'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/ADITYASURVE123/jenkins-practice.git'
            }
        }

        stage('Terraform Init') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aw-credential-id'
                ]]) {
                    sh 'terraform init'
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aw-credential-id'
                ]]) {
                    sh 'terraform plan -out=tfplan'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aw-credential-id'
                ]]) {
                    sh 'terraform apply -input=false -auto-approve tfplan'
                }
            }
        }

        stage('Configure kubectl') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aw-credential-id'
                ]]) {
                    sh 'aws eks update-kubeconfig --region ap-south-1 --name example'
                    sh 'kubectl get nodes'
                }
            }
        }
    }
}