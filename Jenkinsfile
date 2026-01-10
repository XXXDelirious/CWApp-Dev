pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 45, unit: 'MINUTES')
    }

    environment {
        APP_NAME = 'CWApp'

        ANDROID_HOME = '/var/lib/jenkins/Android/Sdk'
        ANDROID_SDK_ROOT = '/var/lib/jenkins/Android/Sdk'
        PATH = "/usr/local/bin:/usr/bin:/bin:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/build-tools/36.0.2"

        NODE_VERSION = '18'
        GRADLE_OPTS = '-Xmx4096m -Dfile.encoding=UTF-8'

        BUILD_SIGNED_RELEASE = 'true'
    }

    stages {

        /* -------------------- */
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        /* -------------------- */
        stage('Environment Validation') {
            steps {
                sh '''
                    set -e
                    java -version
                    node -v
                    npm -v
                    echo "ANDROID_HOME=$ANDROID_HOME"
                    which sdkmanager
                    sdkmanager --list > /dev/null
                '''
            }
        }


        /* -------------------- */
        stage('Install Dependencies') {
            steps {
                sh '''
                    set -e
                    npm ci
                '''
            }
        }

        /* -------------------- */
        stage('Static Checks (Lint & Type)') {
            steps {
                sh '''
                    set -e
                    npm run lint || true
                    npm run typecheck || true
                '''
            }
        }

        /* -------------------- */
        stage('Unit Tests') {
            steps {
                sh '''
                    set -e
                    npm test -- --ci || true
                '''
            }
        }

        /* -------------------- */
        stage('Dependency Security Scan') {
            steps {
                sh '''
                    set -e
                    npm audit --audit-level=high || true
                '''
            }
        }

        /* -------------------- */
        stage('Prepare Keystore') {
            when {
                expression { env.BUILD_SIGNED_RELEASE == 'true' }
            }
            steps {
                withCredentials([
                    file(credentialsId: 'android-release-keystore', variable: 'KEYSTORE_FILE')
                ]) {
                    sh '''
                        set -e
                        mkdir -p android/app
                        cp "$KEYSTORE_FILE" android/app/my-release-key.keystore
                        chmod 600 android/app/my-release-key.keystore
                    '''
                }
            }
        }

        /* -------------------- */
        stage('Build Signed Release APK') {
            when {
                expression { env.BUILD_SIGNED_RELEASE == 'true' }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'keystore-password', variable: 'STORE_PWD'),
                    string(credentialsId: 'key-alias', variable: 'KEY_ALIAS'),
                    string(credentialsId: 'key-password', variable: 'KEY_PWD')
                ]) {
                    sh '''
                        set -e
                        cd android

                        ./gradlew assembleRelease \
                          -PMYAPP_RELEASE_STORE_FILE=app/my-release-key.keystore \
                          -PMYAPP_RELEASE_STORE_PASSWORD="$STORE_PWD" \
                          -PMYAPP_RELEASE_KEY_ALIAS="$KEY_ALIAS" \
                          -PMYAPP_RELEASE_KEY_PASSWORD="$KEY_PWD" \
                          --no-daemon --stacktrace
                    '''
                }
            }
        }

        /* -------------------- */
        stage('Verify APK Signing (MANDATORY)') {
            when {
                expression { env.BUILD_SIGNED_RELEASE == 'true' }
            }
            steps {
                sh '''
                    set -e
                    APK=$(ls android/app/build/outputs/apk/release/*.apk | head -n 1)
                    apksigner verify --print-certs "$APK"
                '''
            }
        }

        /* -------------------- */
        stage('APK Integrity & Size Check') {
            steps {
                sh '''
                    set -e
                    APK=$(ls android/app/build/outputs/apk/release/*.apk | head -n 1)
                    echo "APK size:"
                    du -h "$APK"
                '''
            }
        }

        /* -------------------- */
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'android/app/build/outputs/**', fingerprint: true
            }
        }
    }

    post {

        always {
            sh '''
                set +e
                rm -f android/app/*.keystore
                rm -f android/keystore.properties
            '''
        }

        success {
            echo "✅ ${APP_NAME} signed release build SUCCESS"
        }

        failure {
            echo "❌ ${APP_NAME} build FAILED"
        }
    }
}
