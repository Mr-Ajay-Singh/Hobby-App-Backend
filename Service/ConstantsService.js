class ConstantService {
    static USER_ROLES = {
        ADMIN: 'admin',
        USER: 'user',
        MODERATOR: 'moderator'
    };

    static USER_ROLES_LIST = Object.values(ConstantService.USER_ROLES);

    // Application Statuses
    static STATUS = {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        PENDING: 'pending',
        DELETED: 'deleted'
    };

    static APP_ACTIVITY = {
        LOGIN: {
            action: 'login',
            text: 'logged in'
        },
        UPDATE_PROFILE: {
            action: 'update_profile',
            text: 'updated profile in website'
        },
        UPLOAD_MEDIA: {
            action: 'upload_media',
            text: 'uploaded media to cloud'
        },
        VIEW_FACTS: {
            action: 'view_facts',
            text: 'viewed general facts'
        },
        ADD_FACTS: {
            action: 'add_facts',
            text: 'added general fact to the records'
        },
        VIEW_CATEGORY: {
            action: 'view_category',
            text: 'viewed categories'
        },
        ADD_CATEGORY: {
            action: 'add_category',
            text: 'added category to the records'
        }
    };

    static STATUS_LIST = Object.values(ConstantService.STATUS);

    // Error Messages
    static ERROR_MESSAGES = {
        NOT_FOUND: 'Resource not found',
        INVALID_INPUT: 'Invalid input',
        FORBIDDEN: 'You do not have permission to perform this action',
        UNAUTHORIZED: 'You must be logged in to perform this action',
        SERVER_ERROR: 'An unexpected error occurred on the server'
    };

    static CONFIG = {
        MAX_LOGIN_ATTEMPTS: 5,
        PASSWORD_RESET_TOKEN_EXPIRY: 3600,
        JWT_EXPIRY: '1d',
        SUPPORT_EMAIL: 'support@example.com',
        DEFAULT_PAGE_SIZE: 20
    };

    // Other Constants
    static CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD'];
    static COUNTRIES = ['US', 'CA', 'GB', 'AU', 'FR', 'DE'];
    static SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'es'];
    static DATE_FORMAT = 'YYYY-MM-DD';

    static OTP_EXPIRY_DURATION = 60 * 60 * 1000
    static JWT_EXPIRY_DAY_STRING = '180d'

    static ENV = {
        DEVELOPMENT: 'development',
        PRODUCTION: 'production',
        TEST: 'test'
    };

    static isProduction() {
        return process.env.NODE_ENV === ConstantService.ENV.PRODUCTION;
    }

    static isDevelopment() {
        return process.env.NODE_ENV === ConstantService.ENV.DEVELOPMENT;
    }

    static COMMON_ASSETS = {
        BOY_AVATAR: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/212884_569155.webp',
        FIRE_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/230050566_600684531.png',
        PASSWORD_RESET_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/597742728_208856788.png',
        WELCOME_BANNER: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/18262372_325330784.png',
        OTP_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/320104527_242998628.png',
        ADMIN_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/411300114_141991591.png',
        ANALYSIS_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/863723558_758183404.png',
        BOY_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/868175389_347683092.png',
        BOY_ICON_2: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/570216273_413120544.png',
        CALENDAR_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/78351488_961918568.png',
        COINS_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/220114177_76631009.png',
        DAY_AND_NIGHT_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/95790838_753600206.png',
        DELETE_BIN: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/502111661_349850340.png',
        DEVELOPER_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/528677734_674023214.png',
        GRADUATE_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/322985447_849473297.png',
        GROWTH_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/567122577_500370229.png',
        IT_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/224073200_963216879.png',
        TIMER_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/472044706_444674628.png',
        MAGIC_WAND_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/535084768_468464663.png',
        ADMIN_ICON_2: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/535553763_419020081.png',
        MONEY_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/138003129_905743691.png',
        PAPER_PLANE_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/705067264_244069309.png',
        PRIVACY_POLICY_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/781144265_422431665.png',
        QUIZ_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/645778996_92886448.png',
        QUIZ_ICON_2: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/349178245_355603800.png',
        MONEY_BAG_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/237612358_889019276.png',
        SCHOOL_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/274814401_313218526.png',
        SMILE_EMOJI_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/59500776_38387158.png',
        SETTING_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/73818616_507844504.png',
        SURPRISED_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/270111715_174272219.png',
        SWEAT_EMOJI_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/156429025_297006520.png',
        TARGET_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/260700990_876143394.png',
        TIMER_ICON_2: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/931981410_136568048.png',
        CLOUD_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/137639433_740809468.png',
        GIRL_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/35167826_670855166.png',
        VENTILATOR_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/313295233_820915092.png',
        MEDICAL_RECORD_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/692688515_820899550.png',
        GMAIL_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/625774164_796050375.png',
        API_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/8095559_832541103.png',
        HAPPY_BIRTHDAY: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/573721569_848546668.png',
        BIRTHDAY_BOY_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/740617833_449055111.png',
        CHILD_DANCING_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/157904095_346244874.png',
        VIDEO_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/326106203_795255074.png',
        HOUSE_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/834907268_277967449.png',
        SCISSORS_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/243671666_872564442.png',
        CHOPPING_BOARD_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/819032413_115513612.png',
        BUILDING_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/2718019_591864453.png',
        POWERWASH_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/249469208_780320606.png',
        BUCKET_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/916279861_799718135.png',
        TEAM_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/271864936_424944711.png',
        DOLLAR_POUCH_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/600781919_171794995.png',
        CANNABIS_ICON: 'https://kiranpal-space.blr1.digitaloceanspaces.com/media/boilerplate/e7974a91-16b4-4df3-a33d-071aae052355.png',
        MARIJUANA_ICON: 'https://kiranpal-space.blr1.digitaloceanspaces.com/media/boilerplate/6b72d946-1266-446a-a77d-a158a1fd0433.png',
        EXPRESSJS_ICON: 'https://kiranpal-space.blr1.digitaloceanspaces.com/media/boilerplate/50705ba9-a0d6-483d-a367-340356631fcd.png',
        MONGODB_ICON: 'https://kiranpal-space.blr1.digitaloceanspaces.com/media/boilerplate/ef7afef4-c8cc-4246-939f-330eb473d2b0.png',
        DATABASE_ICON: 'https://kiranpal-space.blr1.digitaloceanspaces.com/media/boilerplate/22bc3f9b-d237-4087-bf8a-2829132b41b9.png',
        GORRILA_ICON: 'https://kiranpal-space.blr1.digitaloceanspaces.com/media/boilerplate/dd7cf64e-7a4a-40a4-8373-bd09595181ee.png',
        MONKEY_ICON: 'https://kiranpal-space.blr1.digitaloceanspaces.com/media/boilerplate/ee92af3e-fa25-4435-85ab-e0947ab805d8.png',
        GOVERN_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/275402429_945000242.png',
        IDENTIFY_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/628064825_749885533.png',
        PROTECT_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/932176231_992419946.png',
        DETECT_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/336569546_152233374.png',
        RESPOND_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/920610546_304756309.png',
        RECOVER_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/823394700_114458264.png',
        VPS_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/252600682_739739740.png',
        ANDROID_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/944580908_400029774.png',
        LINUX_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/166119245_656451829.png',
        FOLDER_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/16140204_542722447.png',
        POSTBOX_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/527470525_155120112.png',
        MATCHING_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/91948004_846598620.png',
        CHECKOUT_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/204284139_525206834.png',
        GOOGLE_MEET_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/602239311_841447593.png',
        POMODORO_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/60118987_31238452.png',
        CYBERSECURITY_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/252931889_951962014.png',
        HEALTHY_FOOD_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/444197197_62652213.png',
        DIET_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/235837741_384963217.png',
        HAMBURGER_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/394006093_219219437.png',
        CATEGORY_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/257580397_919636129.png',
        HIERARCHY_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/915519056_769921978.png',
        LAW_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/45433433_529335584.png',
        BULLET_LIST_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/817152993_480699106.png',
        PYRAMID_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/189113008_818703531.png',
        PRACTICE_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/274528584_713233271.png',
        DOLLARS_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/500192628_489352421.png',
        CAMERA_LENS_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/455871379_756175681.png',
        URL_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/410038706_219877492.png',
        BUG_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/793308579_627609523.png',
        BAG_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/827335930_357029560.png',
        FOOTBALL_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/70659417_55031784.png',
        RUGBY_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/124782275_483560767.png',
        CAR_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/156383447_517851591.png',
        SKULL_ONE_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/533498892_783281131.png',
        SKULL_TWO_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/861743690_728898038.png',
        DOLLAR_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/500192628_489352421.png '
    }

    static COMMON_GIFS = {
        REFERRAL_GIF: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/292685486_65839414.gif',
        SETTINGS_LOADER_GIF: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/824233512_751664852.gif',
        CLOCK_GIF: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/126734678_337207530.gif'
    }

    static COMMON_URLS = {
        JSON_PLACEHOLDER_USERS: 'https://jsonplaceholder.typicode.com/users',
        REQRES_USERS: 'https://reqres.in/api/users?per_page=12',
        RANDOM_DOG_IMAGE: 'https://dog.ceo/api/breeds/image/random',
        RANDOM_CAT_IMAGE: 'https://api.thecatapi.com/v1/images/search',
        FAKER_API_BOOKS: 'https://fakerapi.it/api/v1/books',
        RANDOM_USER: 'https://randomuser.me/api',
        PICSUM_PHOTO: 'https://picsum.photos/600/350',
        DUMMY_JSON_PRODUCTS: 'https://dummyjson.com/products',
        DUMMY_JSON_USERS: 'https://dummyjson.com/users'
    }

    static MAIL_TEMPLATES = {
        FORGOT_PASSWORD: 'forgot_password',
        WELCOME_USER: 'welcome_user',
        SIGNUP_OTP: 'signup_otp'
    }
}

module.exports = ConstantService;
