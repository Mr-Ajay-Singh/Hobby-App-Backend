const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const slugify = require('slugify');
const moment = require('moment');

class StringService {
    static greekNames = [
        'apollo', 'zeus', 'hermes', 'dionysus', 'poseidon', 'ares', 'hephaestus',
        'hades', 'pan', 'eros', 'hestia', 'athena', 'artemis', 'hera', 'demeter',
        'aphrodite', 'persephone', 'nike', 'selene', 'hecate', 'iris', 'nemesis',
        'nyx', 'gaia', 'rhea', 'themis', 'mnemosyne', 'tyche', 'eos', 'heracles',
        'theseus', 'achilles', 'odysseus', 'jason', 'orpheus', 'bellerophon',
        'perseus', 'hephaestus', 'cadmus', 'daedalus', 'minos', 'asclepius',
        'prometheus', 'atlas', 'epimetheus', 'io', 'europa', 'leda', 'medea',
        'helen', 'pandora', 'penelope', 'andromeda', 'cassiopeia', 'clytemnestra',
        'danae', 'daphne', 'electra', 'galatea', 'hebe', 'leto', 'maia', 'muse',
        'oceanid', 'pleione', 'thetis', 'urania', 'calliope', 'clio', 'erato',
        'euterpe', 'melpomene', 'polyhymnia', 'terpsichore', 'thalia', 'calypso',
        'cerberus', 'chimera', 'cyclops', 'hydra', 'minotaur', 'pegasus',
        'phoenix', 'satyr', 'sphinx', 'centaur', 'griffin', 'harpy', 'medusa',
        'sirens', 'stymphalian', 'gorgons', 'laelaps', 'pythia', 'sibyl',
        'talos', 'aeolus', 'circe', 'charon', 'proteus', 'glaucus', 'nereus'
    ]

    static mythicalCreatures = [
        'dragon', 'unicorn', 'mermaid', 'griffin', 'phoenix', 'basilisk', 'chimera', 'hydra',
        'kraken', 'leviathan', 'wyvern', 'pegasus', 'minotaur', 'cerberus', 'faun', 'dryad',
        'siren', 'satyr', 'selkie', 'kelpie', 'banshee', 'yeti', 'bigfoot', 'lochnessmonster',
        'manticore', 'gargoyle', 'werewolf', 'vampire', 'zombie', 'ghoul', 'dullahan', 'ifrit',
        'djinn', 'naga', 'rakshasa', 'aswang', 'tikbalang', 'manananggal', 'tengu', 'oni',
        'kitsune', 'yokai', 'bakunawa', 'qilin', 'fenghuang', 'zhuque', 'longma', 'hulijing',
        'tanuki', 'kappa', 'boggart', 'wendigo', 'skinwalker', 'chupacabra', 'nahual',
        'huaychivo', 'alux', 'leprechaun', 'gnome', 'hobgoblin', 'brownie', 'puca', 'willowisp',
        'blackshuck', 'barghest', 'doppelganger', 'imp', 'succubus', 'incubus', 'shade',
        'poltergeist', 'bunyip', 'mokelembembe', 'amphiptere', 'ziz', 'behemoth', 'almiraj',
        'azhidhaka', 'quetzalcoatl', 'tepeu', 'camazotz', 'xibalba', 'cusith', 'cadairidris',
        'fomorian', 'balor', 'caoineag', 'beannighe', 'sidhe', 'nuckelavee', 'knucker',
        'slavicrusalka', 'domovoi', 'leshy', 'vodyanoy', 'babayaga', 'griff', 'hippogriff',
        'jabberwock', 'wyldewood', 'lamassu', 'valkyrie', 'glastig', 'charybdis', 'scylla',
        'striga', 'caladrius', 'gorgon', 'harpy', 'strix', 'sphinx', 'baize', 'dragoon',
        'seraphim', 'cherubim', 'muse', 'nymph', 'grendel', 'fenrir', 'jormungandr',
        'eidolon', 'silkie', 'krampus', 'dryope', 'eloko', 'kachina', 'ogre', 'elf', 'dwarf',
        'troll', 'sprite', 'pixie', 'nixie', 'golem', 'genie', 'ouroboros', 'kobold',
        'chthonian', 'mamiwata', 'shisa', 'shadhavar', 'umbra', 'marid', 'seiryu', 'byakko',
        'suzaku', 'genbu', 'yurei', 'dzunukwa', 'balrog', 'drekavac', 'cacodaemon',
        'taotie', 'hundun', 'taowu', 'ogopogo', 'tiangou', 'revenant', 'chort', 'cerastes',
        'monoceros', 'nopperabo', 'panderec', 'barlog', 'zhuque', 'arles',
        'beast', 'echidna', 'fenix', 'hydros', 'manticor', 'yali', 'oni', 'basilis',
        'typhon', 'cyclops', 'lilith', 'cetus', 'baku', 'garuda', 'yamata', 'tarasque',
        'quilin', 'huli', 'kirin', 'makara', 'ammit', 'anhur', 'anubis', 'babi',
        'bastet', 'bes', 'raiju', 'kitsunebi', 'musubi', 'bunyip', 'warg', 'pazuzu',
        'calypso', 'eirene', 'erebos', 'medusa', 'dusa', 'selene', 'nyx', 'uranus',
        'gaia', 'chronos', 'ophion', 'phoebe', 'hestia', 'iris', 'khione', 'leda',
        'thalia', 'peitho', 'pan', 'dionysus', 'hades', 'poseidon', 'zeus', 'ares',
        'hermes', 'hephaestus', 'apollo', 'artemis', 'athena', 'demeter', 'hera',
        'janus', 'morpheus', 'moira', 'terpsichore', 'thyone', 'tithonus', 'zagreus'
    ];

    static predefinedQuotes = [
        'Believe in yourself',
        'Stay positive',
        'Never give up',
        'Strive for greatness',
        'Embrace the journey',
        'Dream big',
        'Success is a journey',
        'You are stronger than you think',
        'Make it happen',
        'Keep moving forward'
    ];

    static avatarOptions = [
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/alien-97675g.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/alien4-phjzxk.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/animal-rn1ihu.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/animal1-mvdg3i.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/ape-uyjslm.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/armadillo-m1zpeg.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/bag-jlnhw8.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/bear-4aml1m.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/bee-m5gbvi.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/bee2-gcbs78.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/blackbird-k6udno.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/boy-yqx590.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/boy2-jdo16d.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/bull-u4blv6.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/bull2-9wgwxk.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/bunny-ears-vzz6qr.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/butterfly-kq3fz3.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/cat-0b3iii.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/chameleon-b1523g.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/chicken-czwfss.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/chicken-l3ikek.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/chicken2-uxehpi.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/cow-5i19u2.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/crab-ed81tk.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/crab2-3a3t1o.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/deer-ktjt5a.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/deer2-x5t4rg.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/deer3-ytrgg9.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/deer4-jhpya3.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/destroyed-planet-743dvq.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/dinosaur-qq0or9.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/dragon2-8qcsd3.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/eagle-zxrlpv.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/flamingo-6n43gv.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/footprint-mlvcl9.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/fox-5szpwq.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/frog-zog2ij.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/girl-wx1x9k.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/happy-2f2jh6.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/jaguar-d0nldl.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/jellyfish-3mcds1.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/jellyfish5-qq7z3s.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/kitty-7rsu67.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/koi-uiw4rb.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/ladybug-yarvy4.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/lander-w6v92z.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/leaf-sexffq.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/lion-0yehna.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/lion2-blj1m1.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/llama-pwla5h.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/macaw-xfxhzg.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/mammal-1oaxmw.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/meerkat-idu5mg.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/meteorite-ze64vf.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/michaelangelo-njkdtu.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/monkey-covgff.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/owl-38hqjf.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/panda-xi1u9o.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/parrot-s77pvu.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/pelican-fnd3qq.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/penguin-t3w0iq.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/polar-bear-ppng78.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/pufferfish-h3q50x.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/rabbit-3jxaqn.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/rabbit2-cjifvx.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/rose-con3o3.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/rubberduck-henqd8.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/shark-ofw9qo.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/sloth-nk5cy2.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/sloth2-qo83u6.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/sloth32-6ivfrf.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/space-satellite-q401n0.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/spider-tdz1w7.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/squirrel-h21vat.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/sun-hat-3l186p.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/teenager-3cjdwb.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/toywindmill-bcy3k4.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/turtle-zqxgao.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/weasel-dbf788.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/werewolf-kltjj2.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/wildlife-lnhtap.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/wolf-k955tx.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/avatar/zebra-4ue68x.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/icons/cow-rtnzme.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/icons/duck-mu2arf.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/icons/frog-rl3xob.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/icons/robot-0y0el9.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/icons/robot-2-v566y3.webp",
        "https://kiranpal-space.blr1.cdn.digitaloceanspaces.com/media/icons/rubber-duck-51h2rs.webp"
    ];

    static getAvatarURL = (username) => {
        if (!username) {
            return this.avatarOptions[0];
        }
        const firstChar = username.charAt(0).toUpperCase();
        const index = firstChar.charCodeAt(0) - 65;
        return index >= 0 && index < this.avatarOptions.length
            ? this.avatarOptions[index]
            : this.avatarOptions[0];
    };

    static generateRandomPassword(passwordLength = 6) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    }

    static generateGreekID = async (model) => {
        let uniqueId;
        let isUnique = false;
        while (!isUnique) {
            uniqueId = this.greekNames[Math.floor(Math.random() * this.greekNames.length)] +
                Math.floor(Math.random() * 10000).toString();
            const existingDoc = await model.findOne({ id: uniqueId });
            if (!existingDoc) {
                isUnique = true;
            }
        }
        return uniqueId;
    };

    static generateMythicalID = async () => {
        const mythicalName = this.mythicalCreatures[Math.floor(Math.random() * this.mythicalCreatures.length)]
        const randomNumber = Math.floor(Math.random() * 10000).toString()
        const uniqueID = mythicalName + randomNumber
        return uniqueID
    };

    static async getEncryptedPassword(password) {
        const encryptedPassword = await bcrypt.hash(password, 10)
        return encryptedPassword
    }

    static async generateUserId() {
        return crypto.randomUUID()
    }

    static slugifyString = async (str) => {
        if (!str || str.trim() === '') {
            const randomQuote = this.predefinedQuotes[Math.floor(Math.random() * this.predefinedQuotes.length)];
            str = randomQuote;
        }
        const slug = slugify(str, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
        return slug;
    };

    static shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    static capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    static camelCaseToSnakeCase(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    }

    static async getFilledAggregationResult(aggregateResults, startDate = Date.now() - 30 * 86400000, endDate = Date.now()) {
        try {
            const allDates = [];
            for (let currentDate = startDate; currentDate <= endDate; currentDate += 86400000) {
                allDates.push(moment(currentDate).startOf('day').toDate());
            }

            const filledResults = allDates.map((date) => {
                const result = aggregateResults.find((r) => moment(r.time).isSame(date, 'day'));
                if (result) {
                    return result;
                } else {
                    return {
                        time: date.getTime(),
                        count: 0
                    };
                }
            });

            return filledResults
        } catch (err) {
            return []
        }
    }

    static generateUniqueIdentifier(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let identifier = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            identifier += characters[randomIndex];
        }
        return identifier;
    }

    static generateRandomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    static generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }
}

module.exports = StringService;
