pipeline {
    agent any
    
    // ============================================
    // CWAPP PRODUCTION PIPELINE 
    // ============================================
    
    environment {
        // App Configuration
        APP_NAME = 'CWApp'
        
        ANDROID_HOME = '/var/lib/jenkins/Android/Sdk'
        ANDROID_SDK_ROOT = '/var/lib/jenkins/Android/Sdk'
        PATH = "$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/36.0.2"
        
        // Node.js
        NODE_VERSION = '18.x'
        
        // Build Configuration
        MAX_APK_SIZE_MB = '150'
        MIN_TEST_COVERAGE = '70'
    
        GRADLE_OPTS = '-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        ansiColor('xterm')
    }
    
    parameters {
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip unit tests (NOT RECOMMENDED)'
        )
        booleanParam(
            name: 'CLEAN_BUILD',
            defaultValue: true,
            description: 'Clean all caches before build'
        )
        booleanParam(
            name: 'CLEAR_GRADLE_CACHE',
            defaultValue: false,
            description: 'Clear Gradle cache (use if build fails with CMake errors)'
        )
        booleanParam(
            name: 'BUILD_SIGNED_RELEASE',
            defaultValue: false,
            description: 'Build signed release APK (requires keystore credentials)'
        )
        choice(
            name: 'SECURITY_LEVEL',
            choices: ['MODERATE', 'STRICT', 'SKIP'],
            description: 'Security validation level (STRICT for production, MODERATE for dev)'
        )
    }
    
    stages {
        // ============================================
        // STAGE 1: CHECKOUT
        // ============================================
        stage('Checkout') {
            steps {
                echo '🔄 Checking out source code...'
                checkout scm
                
                script {
                    // Get commit info
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_COMMIT_FULL = sh(
                        script: "git rev-parse HEAD",
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_COMMIT_MSG = sh(
                        script: "git log -1 --pretty=format:'%h - %an, %ar : %s'",
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_BRANCH = sh(
                        script: "git rev-parse --abbrev-ref HEAD",
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_AUTHOR = sh(
                        script: "git log -1 --pretty=%an",
                        returnStdout: true
                    ).trim()
                    
                    echo "✅ Commit: ${env.GIT_COMMIT_MSG}"
                    
                    // Create audit log for compliance
                    def auditLog = [
                        timestamp: new Date().format("yyyy-MM-dd'T'HH:mm:ss"),
                        build_number: BUILD_NUMBER,
                        commit: env.GIT_COMMIT_SHORT,
                        branch: env.GIT_BRANCH,
                        author: env.GIT_AUTHOR,
                        triggered_by: currentBuild.getBuildCauses()[0]?.userId ?: 'auto'
                    ]
                    writeJSON file: "audit-${BUILD_NUMBER}.json", json: auditLog
                }
            }
        }
        
        // ============================================
        // STAGE 2: ENVIRONMENT VERIFICATION
        // 🏭 CRITICAL FOR PRODUCTION
        // ============================================
        stage('Verify Environment') {
            steps {
                echo '🔍 Verifying build environment...'
                sh '''
                    set -e
                    echo "==================================="
                    echo "   ENVIRONMENT VERIFICATION"
                    echo "==================================="
                    
                    # Check Node.js
                    if ! command -v node >/dev/null 2>&1; then
                        echo "❌ ERROR: Node.js not installed"
                        exit 1
                    fi
                    echo "✅ Node.js: $(node --version)"
                    
                    # Check npm
                    if ! command -v npm >/dev/null 2>&1; then
                        echo "❌ ERROR: npm not installed"
                        exit 1
                    fi
                    echo "✅ npm: $(npm --version)"
                    
                    # Check Java
                    if ! command -v java >/dev/null 2>&1; then
                        echo "❌ ERROR: Java not installed"
                        exit 1
                    fi
                    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
                    echo "✅ Java: $JAVA_VERSION"
                    
                    # Verify Android SDK
                    if [ -z "$ANDROID_HOME" ] || [ ! -d "$ANDROID_HOME" ]; then
                        echo "❌ ERROR: ANDROID_HOME not set or directory not found"
                        echo "   ANDROID_HOME: ${ANDROID_HOME:-<not set>}"
                        exit 1
                    fi
                    echo "✅ Android SDK: $ANDROID_HOME"
                    
                    # Check ADB
                    if ! command -v adb >/dev/null 2>&1; then
                        echo "❌ ERROR: ADB not found in PATH"
                        exit 1
                    fi
                    ADB_VERSION=$(adb --version 2>&1 | head -n 1)
                    echo "✅ ADB: $ADB_VERSION"
                    
                    # Check disk space
                    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
                    echo "✅ Disk usage: ${DISK_USAGE}%"
                    if [ "$DISK_USAGE" -gt 85 ]; then
                        echo "⚠️  WARNING: Disk usage above 85%"
                    fi
                    
                    # Check memory
                    if command -v free >/dev/null 2>&1; then
                        FREE_MEM=$(free -m | grep Mem | awk '{print $7}')
                        echo "✅ Free memory: ${FREE_MEM}MB"
                        if [ "$FREE_MEM" -lt 2048 ]; then
                            echo "⚠️  WARNING: Low memory (< 2GB available)"
                        fi
                    fi
                    
                    echo "==================================="
                    echo "✅ Environment verification complete"
                    echo "==================================="
                '''
            }
        }
        
        // ============================================
        // STAGE 3: SECURITY VALIDATION
        // 🏭 CRITICAL FOR PRODUCTION - PREVENTS LEAKS
        // ============================================
        stage('Security Validation') {
            when {
                expression { params.SECURITY_LEVEL != 'SKIP' }
            }
            steps {
                echo '🔒 Running security validation...'
                script {
                    def securityIssues = []
                    
                    sh '''
                        set -e
                        
                        # Check for merge conflicts
                        if grep -r "<<<<<<< HEAD" . --exclude-dir=node_modules --exclude-dir=.git --exclude=Jenkinsfile 2>/dev/null; then
                            echo "❌ ERROR: Merge conflicts detected"
                            exit 1
                        fi
                        echo "✅ No merge conflicts found"
                        
                        # Check for TODO/FIXME
                        TODO_COUNT=$(grep -rE "TODO|FIXME" . --exclude-dir=node_modules --exclude-dir=.git --exclude=Jenkinsfile 2>/dev/null | wc -l || echo "0")
                        if [ "$TODO_COUNT" -gt 0 ]; then
                            echo "⚠️  WARNING: Found $TODO_COUNT TODO/FIXME comments"
                            echo "$TODO_COUNT" > todo_count.txt
                        fi
                        
                        # Check for hardcoded secrets (CRITICAL)
                        echo "Scanning for hardcoded secrets..."
                        SECRETS_FOUND=0
                        
                        # Scan for common secret patterns
                        if grep -rE "(password|secret|api_key|token|private_key)\\s*=\\s*['\"][^'\"]{8,}['\"]" . \
                            --exclude-dir=node_modules \
                            --exclude-dir=.git \
                            --exclude=Jenkinsfile \
                            --exclude="*.json" \
                            --exclude="*.md" \
                            2>/dev/null | grep -v "example\\|sample\\|test\\|placeholder"; then
                            echo "❌ CRITICAL: Possible hardcoded secrets detected"
                            SECRETS_FOUND=1
                        fi
                        
                        # Scan for AWS keys
                        if grep -rE "AKIA[0-9A-Z]{16}" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null; then
                            echo "❌ CRITICAL: Possible AWS access key detected"
                            SECRETS_FOUND=1
                        fi
                        
                        # Scan for private keys
                        if grep -rE "BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null; then
                            echo "❌ CRITICAL: Private key detected in code"
                            SECRETS_FOUND=1
                        fi
                        
                        if [ "$SECRETS_FOUND" -eq 1 ]; then
                            echo "$SECRETS_FOUND" > secrets_found.txt
                        else
                            echo "✅ No hardcoded secrets detected"
                        fi
                        
                        echo "✅ Security validation complete"
                    '''
                    
                    // STRICT mode fails build on secrets
                    if (params.SECURITY_LEVEL == 'STRICT' && fileExists('secrets_found.txt')) {
                        error("🚨 SECURITY FAILURE: Hardcoded secrets detected! Cannot proceed with build.")
                    }
                }
            }
        }
        
        // ============================================
        // STAGE 4: SETUP GOOGLE SERVICES (FIREBASE)
        // ============================================
        stage('Setup Google Services') {
            steps {
                echo '🔐 Setting up Firebase configuration...'
                withCredentials([file(credentialsId: 'google-services-json', variable: 'GOOGLE_SERVICES')]) {
                    sh '''
                        set -e
                        mkdir -p android/app
                        cp $GOOGLE_SERVICES android/app/google-services.json
                        
                        if [ ! -f "android/app/google-services.json" ]; then
                            echo "❌ ERROR: Failed to copy google-services.json"
                            exit 1
                        fi
                        
                        echo "✅ google-services.json configured"
                    '''
                }
            }
        }
        
        // ============================================
        // STAGE 5: SETUP KEYSTORE (CONDITIONAL - FIXED)
        // ============================================
        stage('Setup Keystore') {
            when {
                expression { params.BUILD_SIGNED_RELEASE == true }
            }
            steps {
                script {
                    echo '🔑 Setting up release keystore...'
                    echo 'ℹ️  Checking for Jenkins credentials...'
                    
                    // Check if credentials exist before trying to use them
                    try {
                        withCredentials([
                            file(credentialsId: 'my-release-key.keystore', variable: 'KEYSTORE_FILE'),
                            string(credentialsId: 'keystore-password', variable: 'KEYSTORE_PASSWORD'),
                            string(credentialsId: 'key-alias', variable: 'KEY_ALIAS'),
                            string(credentialsId: 'key-password', variable: 'KEY_PASSWORD')
                        ]) {
                            sh '''
                                set -e
                                
                                echo "✅ All credentials found in Jenkins"
                                echo "   - android-release-keystore: Found"
                                echo "   - keystore-password: Found"
                                echo "   - key-alias: Found"
                                echo "   - key-password: Found"
                                echo ""
                                
                                # Verify keystore file variable is set
                                if [ -z "$KEYSTORE_FILE" ]; then
                                    echo "❌ ERROR: KEYSTORE_FILE variable is empty"
                                    exit 1
                                fi
                                
                                # Verify keystore file exists
                                if [ ! -f "$KEYSTORE_FILE" ]; then
                                    echo "❌ ERROR: Keystore file not found at: $KEYSTORE_FILE"
                                    exit 1
                                fi
                                
                                echo "✅ Keystore file exists: $KEYSTORE_FILE"
                                
                                # Copy keystore to expected location
                                mkdir -p android/app
                                cp "$KEYSTORE_FILE" android/app/my-release-key.keystore
                                
                                # Verify copy was successful
                                if [ ! -f "android/app/my-release-key.keystore" ]; then
                                    echo "❌ ERROR: Failed to copy keystore to android/app/"
                                    exit 1
                                fi
                                
                                echo "✅ Keystore copied to: android/app/my-release-key.keystore"
                                
                                # Verify all credential variables are set
                                if [ -z "$KEYSTORE_PASSWORD" ]; then
                                    echo "❌ ERROR: keystore-password is empty"
                                    exit 1
                                fi
                                
                                if [ -z "$KEY_ALIAS" ]; then
                                    echo "❌ ERROR: key-alias is empty"
                                    exit 1
                                fi
                                
                                if [ -z "$KEY_PASSWORD" ]; then
                                    echo "❌ ERROR: key-password is empty"
                                    exit 1
                                fi
                                
                                echo "✅ All credential values are set"
                                
                                # Create keystore.properties
                                cat > android/keystore.properties << EOF
storePassword=$KEYSTORE_PASSWORD
keyPassword=$KEY_PASSWORD
keyAlias=$KEY_ALIAS
storeFile=my-release-key.keystore
EOF
                                
                                # Verify keystore.properties was created
                                if [ ! -f "android/keystore.properties" ]; then
                                    echo "❌ ERROR: Failed to create keystore.properties"
                                    exit 1
                                fi
                                
                                echo "✅ keystore.properties created"
                                echo ""
                                echo "═══════════════════════════════════════"
                                echo "✅ Keystore setup completed successfully"
                                echo "   Location: android/app/my-release-key.keystore"
                                echo "   Properties: android/keystore.properties"
                                echo "   Alias: $KEY_ALIAS"
                                echo "═══════════════════════════════════════"
                            '''
                        }
                    } catch (Exception e) {
                        echo "❌ Error occurred: ${e.getMessage()}"
                        echo ""
                        error """
🚨 KEYSTORE SETUP FAILED!

Error Details: ${e.getMessage()}

The following credentials must exist in Jenkins with EXACT IDs:
  ┌─────────────────────────────────────────────────┐
  │ Credential ID              │ Type              │
  ├─────────────────────────────────────────────────┤
  │ android-release-keystore   │ Secret file       │
  │ keystore-password          │ Secret text       │
  │ key-alias                  │ Secret text       │
  │ key-password               │ Secret text       │
  └─────────────────────────────────────────────────┘

Troubleshooting Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Go to: Jenkins → Manage Jenkins → Credentials
2. Click on "(global)" domain (or your specific domain)
3. Verify each credential exists with the EXACT ID shown above
4. The ID must match exactly (case-sensitive)
5. Make sure credentials are in the correct scope
6. Click on each credential to verify it has content

Common Issues:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Credential ID has typo (e.g., "android-keystore" instead of "android-release-keystore")
❌ Credential is in wrong scope (folder-level instead of global)
❌ Secret file is empty or corrupt
❌ Passwords contain special characters that need escaping

How to Create Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Jenkins → Manage Jenkins → Credentials → System → Global credentials
2. Click "Add Credentials"
3. For keystore:
   - Kind: Secret file
   - File: Upload your my-release-key.keystore
   - ID: android-release-keystore (exactly this)
4. For passwords:
   - Kind: Secret text
   - Secret: Your password/alias
   - ID: Must match exactly (keystore-password, key-alias, key-password)

If credentials are configured correctly but still failing:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Check Jenkins system logs
• Verify Jenkins has read permission on credential store
• Try recreating the credentials
• Check if credential plugin is installed and up to date

For now, you can build an unsigned APK by setting:
BUILD_SIGNED_RELEASE = false
                        """
                    }
                }
            }
        }
        
        // ============================================
        // STAGE 6: CLEAR GRADLE CACHE 
        // ============================================
        stage('Clear Gradle Cache') {
            when {
                expression { params.CLEAR_GRADLE_CACHE == true }
            }
            steps {
                echo '🗑️ Clearing Gradle caches (fixing CMake/fbjni issues)...'
                sh '''
                    set -e
                    
                    echo "Removing Gradle caches..."
                    rm -rf ~/.gradle/caches/transforms-*/
                    rm -rf ~/.gradle/caches/modules-*/
                    rm -rf android/.gradle/
                    rm -rf android/app/.cxx/
                    rm -rf android/app/build/
                    rm -rf android/build/
                    
                    echo "✅ Gradle caches cleared"
                '''
            }
        }
        
        // ============================================
        // STAGE 7: INSTALL DEPENDENCIES
        // ============================================
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                
                script {
                    if (params.CLEAN_BUILD) {
                        sh '''
                            echo "🧹 Performing clean build..."
                            rm -rf node_modules package-lock.json yarn.lock
                            npm cache clean --force
                        '''
                    }
                    
                    // Install with retry logic
                    retry(3) {
                        sh '''
                            set -e
                            
                            # Install dependencies
                            npm install --legacy-peer-deps \
                                --fetch-timeout=600000 \
                                2>&1 | tee npm-install.log
                            
                            # Verify critical packages
                            if [ ! -d "node_modules/react-native" ]; then
                                echo "❌ ERROR: react-native not installed"
                                exit 1
                            fi
                            
                            echo "✅ Dependencies installed successfully"
                        '''
                    }
                }
            }
        }
        
        // ============================================
        // STAGE 8: SECURITY SCANNING
        // 🏭 CRITICAL FOR PRODUCTION - CVE DETECTION
        // ============================================
        stage('Security Scanning') {
            when {
                expression { params.SECURITY_LEVEL != 'SKIP' }
            }
            steps {
                echo '🔍 Scanning for vulnerabilities...'
                script {
                    sh '''
                        set -e
                        
                        echo "Running npm audit..."
                        npm audit --audit-level=high --json > npm-audit.json || true
                        
                        # Extract vulnerability counts safely
                        CRITICAL=$(cat npm-audit.json | grep -o '"critical":[0-9]*' | grep -o '[0-9]*' || echo "0")
                        HIGH=$(cat npm-audit.json | grep -o '"high":[0-9]*' | grep -o '[0-9]*' || echo "0")
                        MODERATE=$(cat npm-audit.json | grep -o '"moderate":[0-9]*' | grep -o '[0-9]*' || echo "0")
                        
                        # Default to 0 if empty
                        CRITICAL=${CRITICAL:-0}
                        HIGH=${HIGH:-0}
                        MODERATE=${MODERATE:-0}
                        
                        echo "Security scan results:"
                        echo "  Critical: $CRITICAL"
                        echo "  High: $HIGH"
                        echo "  Moderate: $MODERATE"
                        
                        # Save for later decision
                        echo "$CRITICAL" > critical_vulns.txt
                        echo "$HIGH" > high_vulns.txt
                        
                        if [ "$CRITICAL" -gt 0 ]; then
                            echo "🚨 CRITICAL: Found $CRITICAL critical vulnerabilities"
                        fi
                        
                        if [ "$HIGH" -gt 5 ]; then
                            echo "⚠️  WARNING: Found $HIGH high severity vulnerabilities"
                        fi
                        
                        echo "✅ Security scan completed"
                    '''
                    
                    // STRICT mode fails on critical vulnerabilities
                    if (params.SECURITY_LEVEL == 'STRICT') {
                        def criticalVulns = readFile('critical_vulns.txt').trim() as Integer
                        if (criticalVulns > 0) {
                            error("🚨 SECURITY FAILURE: ${criticalVulns} critical vulnerabilities found! Cannot proceed.")
                        }
                    }
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'npm-audit.json', allowEmptyArchive: true
                }
            }
        }
        
        // ============================================
        // STAGE 9: CODE QUALITY
        // 🏭 IMPORTANT FOR PRODUCTION - PREVENTS BUGS
        // ============================================
        stage('Code Quality') {
            steps {
                echo '📊 Running code quality checks...'
                script {
                    def lintFailed = false
                    
                    sh '''
                        set -e
                        
                        # ESLint (if configured)
                        if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
                            echo "Running ESLint..."
                            npm run lint 2>&1 | tee eslint.log || {
                                echo "⚠️  Linting issues found"
                                echo "1" > lint_failed.txt
                            }
                        else
                            echo "ℹ️  No ESLint config found, skipping"
                        fi
                        
                        # Prettier (if configured)
                        if [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ]; then
                            echo "Checking code formatting..."
                            npm run prettier:check 2>&1 | tee prettier.log || {
                                echo "⚠️  Formatting issues found"
                            }
                        else
                            echo "ℹ️  No Prettier config found, skipping"
                        fi
                        
                        echo "✅ Code quality checks completed"
                    '''
                    
                    // For production branches, fail on lint errors
                    if (env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'master' || env.GIT_BRANCH == 'production') {
                        if (fileExists('lint_failed.txt')) {
                            unstable(message: "Code quality issues detected on ${env.GIT_BRANCH} branch")
                        }
                    }
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: '*.log', allowEmptyArchive: true
                }
            }
        }
        
        // ============================================
        // STAGE 10: UNIT TESTS
        // ============================================
        stage('Unit Tests') {
            steps {
                script {
                    if (params.SKIP_TESTS) {
                        echo '⏭️  Skipping tests (SKIP_TESTS = true)'
                        echo '⚠️  WARNING: Tests skipped - not recommended for production!'
                    } else {
                        echo '🧪 Running unit tests...'
                        sh '''
                            set -e
                            export TZ=UTC
                            
                            if [ ! -d "__tests__" ] && [ ! -d "tests" ]; then
                                echo "⚠️  No test directory found, skipping tests"
                                exit 0
                            fi
                            
                            npm test -- --coverage || true
                            echo "✅ Unit tests completed"
                        '''
                    }
                }
            }
            post {
                always {
                    script {
                        if (!params.SKIP_TESTS) {
                            junit testResults: '**/junit.xml', allowEmptyResults: true
                            if (fileExists('coverage/index.html')) {
                                publishHTML(target: [
                                    allowMissing: true,
                                    alwaysLinkToLastBuild: true,
                                    keepAll: true,
                                    reportDir: 'coverage',
                                    reportFiles: 'index.html',
                                    reportName: 'Coverage Report'
                                ])
                            }
                        }
                    }
                }
            }
        }
        
        // ============================================
        // STAGE 11: CLEAN ANDROID BUILD 
        // ============================================
        stage('Clean Android') {
            steps {
                echo '🧹 Cleaning Android build...'
                sh '''
                    set -e
                    cd android
                    
                    # Stop any existing Gradle daemons
                    chmod +x gradlew
                    ./gradlew --stop 2>/dev/null || true
                    
                    # Remove build artifacts and CMake cache
                    echo "Removing local build artifacts..."
                    rm -rf .gradle/
                    rm -rf app/.cxx/
                    rm -rf app/build/
                    rm -rf build/
                    
                    # Set proper Java options
                    export GRADLE_OPTS="-Xmx4096m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8"
                    
                    # Run clean
                    echo "Running Gradle clean..."
                    ./gradlew clean --no-daemon --stacktrace || {
                        echo "⚠️  Clean failed, attempting cache clear..."
                        rm -rf ~/.gradle/caches/transforms-*/
                        ./gradlew clean --no-daemon --stacktrace
                    }
                    
                    echo "✅ Android build cleaned"
                '''
            }
        }
        
        // ============================================
        // STAGE 12: BUILD DEBUG APK (ALWAYS)
        // ============================================
        stage('Build Debug APK') {
            steps {
                echo '🔨 Building Android Debug APK (unsigned)...'
                sh '''
                    set -e
                    cd android
                    chmod +x gradlew
                    
                    echo "Building debug APK..."
                    
                    # Set memory and encoding
                    export GRADLE_OPTS="-Xmx4096m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8"
                    
                    # Build debug APK (no signing required)
                    ./gradlew assembleDebug --no-daemon --stacktrace 2>&1 | tee ../gradle-debug.log || {
                        echo "⚠️  Build failed, clearing transforms cache and retrying..."
                        rm -rf ~/.gradle/caches/transforms-*/
                        rm -rf app/.cxx/
                        ./gradlew assembleDebug --no-daemon --stacktrace 2>&1 | tee ../gradle-debug.log
                    }
                    
                    # Verify APK was created
                    DEBUG_APK="app/build/outputs/apk/debug/app-debug.apk"
                    if [ ! -f "$DEBUG_APK" ]; then
                        echo "❌ ERROR: Debug APK not found at $DEBUG_APK"
                        exit 1
                    fi
                    
                    # Copy to workspace root
                    cp "$DEBUG_APK" ../app-debug.apk
                    
                    # Get APK info
                    APK_SIZE=$(du -h "$DEBUG_APK" | cut -f1)
                    echo "✅ Debug APK built successfully: $APK_SIZE"
                    echo "   Location: $DEBUG_APK"
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'gradle-debug.log', allowEmptyArchive: true
                }
            }
        }
        
        // ============================================
        // STAGE 13: BUILD SIGNED RELEASE APK (CONDITIONAL)
        // ============================================
        stage('Build Signed Release APK') {
            when {
                expression { params.BUILD_SIGNED_RELEASE == true }
            }
            steps {
                echo '🔨 Building Signed Android Release APK...'
                sh '''
                    set -e
                    cd android
                    chmod +x gradlew
                    
                    echo "Building signed release APK..."
                    
                    # Verify keystore exists
                    if [ ! -f "app/my-release-key.keystore" ]; then
                        echo "❌ ERROR: Keystore not found. Did the 'Setup Keystore' stage run?"
                        exit 1
                    fi
                    
                    # Set memory and encoding
                    export GRADLE_OPTS="-Xmx4096m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8"
                    
                    # Build signed release APK
                    ./gradlew assembleRelease --no-daemon --stacktrace 2>&1 | tee ../gradle-release.log || {
                        echo "⚠️  Build failed, clearing transforms cache and retrying..."
                        rm -rf ~/.gradle/caches/transforms-*/
                        rm -rf app/.cxx/
                        ./gradlew assembleRelease --no-daemon --stacktrace 2>&1 | tee ../gradle-release.log
                    }
                    
                    # Verify APK was created
                    RELEASE_APK="app/build/outputs/apk/release/app-release.apk"
                    if [ ! -f "$RELEASE_APK" ]; then
                        echo "❌ ERROR: Release APK not found at $RELEASE_APK"
                        exit 1
                    fi
                    
                    # Copy to workspace root
                    cp "$RELEASE_APK" ../app-release-signed.apk
                    
                    # Get APK info
                    APK_SIZE=$(du -h "$RELEASE_APK" | cut -f1)
                    echo "✅ Signed Release APK built successfully: $APK_SIZE"
                    echo "   Location: $RELEASE_APK"
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'gradle-release.log', allowEmptyArchive: true
                }
            }
        }
        
        // ============================================
        // STAGE 14: BUILD UNSIGNED RELEASE APK (DEFAULT)
        // ============================================
        stage('Build Unsigned Release APK') {
            when {
                expression { params.BUILD_SIGNED_RELEASE == false }
            }
            steps {
                echo '🔨 Building Unsigned Release APK...'
                sh '''
                    set -e
                    cd android
                    
                    # Temporarily disable signing in build.gradle
                    echo "Disabling release signing configuration..."
                    
                    # Backup original build.gradle
                    cp app/build.gradle app/build.gradle.backup
                    
                    # Comment out signing config for release
                    sed -i.bak '/signingConfig signingConfigs.release/s/^/\\/\\//' app/build.gradle || true
                    
                    chmod +x gradlew
                    
                    echo "Building unsigned release APK..."
                    
                    # Set memory and encoding
                    export GRADLE_OPTS="-Xmx4096m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8"
                    
                    # Build unsigned release APK
                    ./gradlew assembleRelease --no-daemon --stacktrace 2>&1 | tee ../gradle-release.log || {
                        echo "⚠️  Build failed, clearing transforms cache and retrying..."
                        rm -rf ~/.gradle/caches/transforms-*/
                        rm -rf app/.cxx/
                        ./gradlew assembleRelease --no-daemon --stacktrace 2>&1 | tee ../gradle-release.log
                    }
                    
                    # Restore original build.gradle
                    if [ -f "app/build.gradle.backup" ]; then
                        mv app/build.gradle.backup app/build.gradle
                    fi
                    
                    # Verify APK was created
                    RELEASE_APK="app/build/outputs/apk/release/app-release-unsigned.apk"
                    
                    # Check both possible names
                    if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
                        RELEASE_APK="app/build/outputs/apk/release/app-release.apk"
                    fi
                    
                    if [ ! -f "$RELEASE_APK" ]; then
                        echo "❌ ERROR: Release APK not found"
                        ls -la app/build/outputs/apk/release/ || true
                        exit 1
                    fi
                    
                    # Copy to workspace root
                    cp "$RELEASE_APK" ../app-release-unsigned.apk
                    
                    # Get APK info
                    APK_SIZE=$(du -h "$RELEASE_APK" | cut -f1)
                    echo "✅ Unsigned Release APK built successfully: $APK_SIZE"
                    echo "   Location: $RELEASE_APK"
                    echo ""
                    echo "⚠️  NOTE: This APK is UNSIGNED and for testing only"
                    echo "   For production, re-run with BUILD_SIGNED_RELEASE=true"
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'gradle-release.log', allowEmptyArchive: true
                }
            }
        }
        
        // ============================================
        // STAGE 15: APK ANALYSIS
        // 🏭 IMPORTANT FOR PRODUCTION - VERIFICATION
        // ============================================
        stage('APK Analysis') {
            steps {
                echo '🔍 Analyzing APKs...'
                sh '''
                    set -e
                    
                    echo "=== Debug APK Analysis ==="
                    if [ -f "app-debug.apk" ]; then
                        aapt dump badging "app-debug.apk" | grep -E "package|application-label|versionCode|versionName|sdkVersion" || true
                        sha256sum app-debug.apk > app-debug.apk.sha256
                        echo "Debug SHA256: $(cat app-debug.apk.sha256 | awk '{print $1}')"
                    fi
                    
                    echo ""
                    echo "=== Release APK Analysis ==="
                    if [ -f "app-release-signed.apk" ]; then
                        echo "Signed Release APK:"
                        aapt dump badging "app-release-signed.apk" | grep -E "package|application-label|versionCode|versionName|sdkVersion" || true
                        sha256sum app-release-signed.apk > app-release-signed.apk.sha256
                        echo "Signed Release SHA256: $(cat app-release-signed.apk.sha256 | awk '{print $1}')"
                    fi
                    
                    if [ -f "app-release-unsigned.apk" ]; then
                        echo "Unsigned Release APK:"
                        aapt dump badging "app-release-unsigned.apk" | grep -E "package|application-label|versionCode|versionName|sdkVersion" || true
                        sha256sum app-release-unsigned.apk > app-release-unsigned.apk.sha256
                        echo "Unsigned Release SHA256: $(cat app-release-unsigned.apk.sha256 | awk '{print $1}')"
                    fi
                    
                    echo ""
                    echo "✅ Analysis completed"
                '''
            }
        }
        
        // ============================================
        // STAGE 16: ARCHIVE & BUILD INFO
        // ============================================
        stage('Archive APKs') {
            steps {
                echo '📦 Archiving build artifacts...'
                
                // Archive APKs
                archiveArtifacts artifacts: 'android/app/build/outputs/apk/**/*.apk', 
                                fingerprint: true,
                                allowEmptyArchive: true
                
                archiveArtifacts artifacts: '*.apk,*.sha256', 
                                fingerprint: true,
                                allowEmptyArchive: true
                
                // Create build info
                sh '''
                    BUILD_DATE=$(date '+%Y-%m-%d %H:%M:%S')
                    
                    # Check which APKs were built
                    DEBUG_APK=""
                    RELEASE_APK=""
                    RELEASE_TYPE="None"
                    
                    if [ -f "app-debug.apk" ]; then
                        DEBUG_SIZE=$(ls -lh app-debug.apk | awk '{print $5}')
                        DEBUG_SHA=$(cat app-debug.apk.sha256 | awk '{print $1}')
                        DEBUG_APK="✅ Built"
                    else
                        DEBUG_APK="❌ Not built"
                    fi
                    
                    if [ -f "app-release-signed.apk" ]; then
                        RELEASE_SIZE=$(ls -lh app-release-signed.apk | awk '{print $5}')
                        RELEASE_SHA=$(cat app-release-signed.apk.sha256 | awk '{print $1}')
                        RELEASE_TYPE="Signed"
                        RELEASE_APK="app-release-signed.apk"
                    elif [ -f "app-release-unsigned.apk" ]; then
                        RELEASE_SIZE=$(ls -lh app-release-unsigned.apk | awk '{print $5}')
                        RELEASE_SHA=$(cat app-release-unsigned.apk.sha256 | awk '{print $1}')
                        RELEASE_TYPE="Unsigned (Testing Only)"
                        RELEASE_APK="app-release-unsigned.apk"
                    fi
                    
                    # Get package info from debug APK
                    PACKAGE_NAME=$(aapt dump badging app-debug.apk | grep package | awk '{print $2}' | sed "s/name='//g" | sed "s/'//g" || echo "N/A")
                    VERSION_CODE=$(aapt dump badging app-debug.apk | grep versionCode | awk '{print $3}' | sed "s/versionCode='//g" | sed "s/'//g" || echo "N/A")
                    VERSION_NAME=$(aapt dump badging app-debug.apk | grep versionName | awk '{print $4}' | sed "s/versionName='//g" | sed "s/'//g" || echo "N/A")
                    
                    cat > build-info.txt << EOF
╔════════════════════════════════════════╗
║        CWApp Build Information         ║
╚════════════════════════════════════════╝

Build Number:    ${BUILD_NUMBER}
Build Date:      ${BUILD_DATE}
Git Commit:      ${GIT_COMMIT_SHORT} (${GIT_COMMIT_FULL})
Git Branch:      ${GIT_BRANCH}
Git Author:      ${GIT_AUTHOR}
Jenkins Job:     ${JOB_NAME}
Build URL:       ${BUILD_URL}

App Information:
─────────────────────────────────────────
Package:         ${PACKAGE_NAME}
Version:         ${VERSION_NAME} (${VERSION_CODE})

📱 APK Artifacts:
─────────────────────────────────────────
🔴 Debug APK: ${DEBUG_APK}
$(if [ -f "app-debug.apk" ]; then echo "   File: app-debug.apk"; echo "   Size: ${DEBUG_SIZE}"; echo "   SHA256: ${DEBUG_SHA}"; fi)

🟢 Release APK: ${RELEASE_TYPE}
$(if [ -n "$RELEASE_APK" ]; then echo "   File: ${RELEASE_APK}"; echo "   Size: ${RELEASE_SIZE}"; echo "   SHA256: ${RELEASE_SHA}"; fi)

$(if [ "$RELEASE_TYPE" = "Unsigned (Testing Only)" ]; then echo "⚠️  IMPORTANT: Release APK is UNSIGNED"; echo "   This APK is for TESTING ONLY"; echo "   For production builds, run with BUILD_SIGNED_RELEASE=true"; echo "   and configure keystore credentials in Jenkins"; fi)

Download Links:
─────────────────────────────────────────
$(if [ -f "app-debug.apk" ]; then echo "Debug APK:   ${BUILD_URL}artifact/app-debug.apk"; fi)
$(if [ -f "app-release-signed.apk" ]; then echo "Signed Release: ${BUILD_URL}artifact/app-release-signed.apk"; fi)
$(if [ -f "app-release-unsigned.apk" ]; then echo "Unsigned Release: ${BUILD_URL}artifact/app-release-unsigned.apk"; fi)

Installation:
─────────────────────────────────────────
# Install via ADB
$(if [ -f "app-debug.apk" ]; then echo "adb install app-debug.apk"; fi)
$(if [ -f "app-release-unsigned.apk" ]; then echo "adb install app-release-unsigned.apk"; fi)
$(if [ -f "app-release-signed.apk" ]; then echo "adb install app-release-signed.apk"; fi)

╚════════════════════════════════════════╝
EOF
                    cat build-info.txt
                '''
                
                archiveArtifacts artifacts: 'build-info.txt,audit-*.json', 
                                fingerprint: true,
                                allowEmptyArchive: true
            }
        }
    }
    
    // ============================================
    // POST-BUILD ACTIONS
    // ============================================
    post {
        always {
            script {
                echo "═══════════════════════════════════════════════════"
                echo "  BUILD COMPLETED - STATUS: ${currentBuild.result ?: 'SUCCESS'}"
                echo "═══════════════════════════════════════════════════"
            }
            
            // Clean sensitive files
            sh '''
                echo "🧹 Cleaning sensitive files..."
                rm -f android/app/google-services.json
                rm -f android/app/my-release-key.keystore
                rm -f android/app/release.keystore
                rm -f android/keystore.properties
                find . -name "*.keystore" -delete 2>/dev/null || true
                find . -name "*.jks" -delete 2>/dev/null || true
                echo "✅ Cleanup completed"
            '''
            
            // Clean workspace
            cleanWs(
                deleteDirs: true,
                patterns: [
                    [pattern: 'node_modules', type: 'INCLUDE'],
                    [pattern: 'android/build', type: 'INCLUDE'],
                    [pattern: 'android/app/build', type: 'INCLUDE']
                ]
            )
        }
        
        success {
            script {
                def durationSeconds = currentBuild.duration / 1000
                def durationMinutes = String.format("%.1f", durationSeconds / 60)
                
                echo "✅ BUILD SUCCESSFUL!"
                echo ""
                echo "📱 APK Downloads:"
                
                if (fileExists('app-debug.apk')) {
                    echo "   🔴 Debug APK: ${BUILD_URL}artifact/app-debug.apk"
                }
                
                if (params.BUILD_SIGNED_RELEASE && fileExists('app-release-signed.apk')) {
                    echo "   🟢 Signed Release APK: ${BUILD_URL}artifact/app-release-signed.apk"
                } else if (fileExists('app-release-unsigned.apk')) {
                    echo "   🟡 Unsigned Release APK: ${BUILD_URL}artifact/app-release-unsigned.apk"
                    echo "   ⚠️  This is unsigned - for testing only!"
                }
                
                echo ""
                echo "📄 Build Info: ${BUILD_URL}artifact/build-info.txt"
                echo "⏱️  Duration: ${durationMinutes} minutes"
            }
        }
        
        failure {
            echo "❌ BUILD FAILED!"
            echo "Check console output: ${BUILD_URL}console"
            echo ""
            echo "Common fixes:"
            echo "1. Re-run build with 'CLEAR_GRADLE_CACHE' enabled"
            echo "2. Verify google-services.json credential is configured"
            echo "3. If building signed release, ensure keystore credentials are set up"
        }
        
        unstable {
            echo "⚠️  BUILD UNSTABLE (tests failed but APKs built)"
        }
    }
}
