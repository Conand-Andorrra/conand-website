import { getPayload } from './lib/payload'
import path from 'path'
import fs from 'fs'

async function seed() {
  console.log('🌱 Starting seed...')

  // Temporarily set NODE_ENV to development so Payload pushes the schema (creates tables)
  const originalNodeEnv = process.env.NODE_ENV
  ;(process.env as Record<string, string | undefined>).NODE_ENV = 'development'

  const payload = await getPayload()
  console.log('  ✅ Schema ready')

  // Restore NODE_ENV
  ;(process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  const collections = ['events', 'speakers', 'sponsors', 'media'] as const
  for (const col of collections) {
    const existing = await payload.find({ collection: col, limit: 1000 })
    for (const doc of existing.docs) {
      await payload.delete({ collection: col, id: doc.id })
    }
  }

  // ─── MEDIA ───────────────────────────────────────────────
  console.log('📸 Uploading media...')
  const imgDir = path.resolve(process.cwd(), 'public/img')
  const mediaMap: Record<string, number> = {}

  async function uploadImage(filename: string, alt: string) {
    const filePath = path.join(imgDir, filename)
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠️  Image not found: ${filename}`)
      return null
    }
    const buffer = fs.readFileSync(filePath)
    const ext = path.extname(filename).slice(1)
    const mimeMap: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', webp: 'image/webp' }
    const result = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data: buffer, name: filename, mimetype: mimeMap[ext] || 'image/png', size: buffer.length },
    })
    mediaMap[filename] = result.id as number
    return result.id
  }

  // Upload all images
  const imagesToUpload = [
    ['conand_logo.png', 'CONAND Logo'],
    ['conand_2_img7_opt.png', 'CONAND DevFest 2025'],
    ['conand_2_img7_opt1_1.png', 'CONAND DevFest 2025 Featured'],
    ['conand_2_img8_opt.png', 'CONAND DevFest 2025'],
    ['conand_1_img4_opt.png', 'CONAND Event'],
    ['conand_1_img5_opt.png', 'CONAND Meetup June'],
    ['conand_1_img6_opt.png', 'CONAND Meetup March'],
    ['conand_0_img1_opt.jpg', 'CONAND About 1'],
    ['conand_0_img2_opt.jpg', 'CONAND About 2'],
    // Speaker photos
    ['carlos_delcorral_opt.jpeg', 'Carlos Del Corral'],
    ['maximo_fernandez_opt.jpeg', 'Maximo Fernandez'],
    ['mario_ezquerro_opt.png', 'Mario Ezquerro'],
    ['xavier_portilla_opt.png', 'Xavier Portilla'],
    ['toni_delafuente_opt.jpeg', 'Toni De La Fuente'],
    ['kevin_alberto_opt.jpeg', 'Kevin Alberto Sanchez'],
    ['maria_aperador_opt.jpeg', 'Maria Aperador'],
    ['speaker_claudio_amorin_opt.jpeg', 'Claudio Amorim'],
    ['speaker_dimitri_tarasowski_opt.jpeg', 'Dimitri Tarasowski'],
    ['speaker_oriol_matavacas_opt.jpeg', 'Oriol Matavacas'],
    ['speaker_marc_rivero_opt.jpeg', 'Marc Rivero'],
    // Sponsor logos
    ['andsoft_opt.png', 'AndSoft'],
    ['rapidand_opt.png', 'RapidAnd'],
    ['vargroup_opt.png', 'VarGroup'],
    ['seidor_opt.png', 'Seidor'],
    ['sosmatic_opt.png', 'SOSMatic'],
    ['tda_opt.png', 'TDA'],
    ['andorsoft_opt.png', 'Andorsoft'],
    ['andorra_vella_opt.png', 'Andorra la Vella'],
    ['pat_santagloria_opt.png', 'SantaGloria'],
    ['google_opt.png', 'Google'],
    ['pat_andbusiness_opt.png', 'Andorra Business'],
    ['pat_actin_opt.png', 'Actinn'],
    ['conand_pat_sinzerad_opt.png', 'SinzerAD'],
    ['conand_pat_piadvocats_opt.png', 'P.I. Advocats'],
    ['pat_alpine_opt.png', 'Alpine Security'],
    ['pat_rcasociats_opt.png', 'RCAssociats'],
    ['pat_aprop_opt.png', 'APropSI'],
  ]

  for (const [filename, alt] of imagesToUpload) {
    console.log(`  📷 ${filename}`)
    await uploadImage(filename, alt)
  }

  // ─── SPONSORS ────────────────────────────────────────────
  console.log('🏢 Creating sponsors...')
  const sponsorMap: Record<string, number> = {}

  async function createSponsor(name: string, logo: string, tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'collaborator', isGlobal: boolean, url?: string) {
    const logoId = mediaMap[logo]
    const result = await payload.create({
      collection: 'sponsors',
      data: { name, logo: logoId, tier, isGlobal, url: url || '' },
    })
    sponsorMap[name] = result.id as number
    console.log(`  🏷️  ${name} (${tier}, ${isGlobal ? 'global' : 'event'})`)
  }

  // Global sponsors
  await createSponsor('AndSoft', 'andsoft_opt.png', 'platinum', true, 'https://andsoft.es/')
  await createSponsor('RapidAnd', 'rapidand_opt.png', 'gold', true, 'https://rapidand.com/')
  await createSponsor('VarGroup', 'vargroup_opt.png', 'gold', true, 'https://www.vargroup.es/')
  await createSponsor('Seidor', 'seidor_opt.png', 'gold', true, 'https://www.seidor.com/')
  await createSponsor('SOSMatic', 'sosmatic_opt.png', 'silver', true, 'https://www.sosmatic.com/')
  await createSponsor('TDA', 'tda_opt.png', 'silver', true, 'https://www.tda.ad/')
  await createSponsor('Andorsoft', 'andorsoft_opt.png', 'bronze', true, 'https://andorsoft.com/')
  await createSponsor('Andorra la Vella', 'andorra_vella_opt.png', 'collaborator', true, 'https://www.turismeandorralavella.com/')
  await createSponsor('SantaGloria', 'pat_santagloria_opt.png', 'collaborator', true, 'https://www.santagloria.com/')
  await createSponsor('Google', 'google_opt.png', 'collaborator', true, 'https://www.google.com')
  await createSponsor('Andorra Business', 'pat_andbusiness_opt.png', 'collaborator', true, 'https://www.andorrabusiness.com/')
  await createSponsor('Actinn', 'pat_actin_opt.png', 'collaborator', true, 'https://actinn.ad/')
  // Event-only sponsors
  await createSponsor('SinzerAD', 'conand_pat_sinzerad_opt.png', 'gold', false)
  await createSponsor('P.I. Advocats', 'conand_pat_piadvocats_opt.png', 'collaborator', false)
  await createSponsor('Alpine Security', 'pat_alpine_opt.png', 'silver', false)
  await createSponsor('RCAssociats', 'pat_rcasociats_opt.png', 'silver', false)
  await createSponsor('APropSI', 'pat_aprop_opt.png', 'bronze', false)

  // ─── SPEAKERS ────────────────────────────────────────────
  console.log('🎤 Creating speakers...')
  const speakerMap: Record<string, number> = {}

  function richText(text: string) {
    return {
      root: {
        type: 'root' as const,
        children: [{ type: 'paragraph', children: [{ type: 'text', text, version: 1 }], version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    }
  }

  async function createSpeaker(name: string, title: string, photo: string, bios: { ca: string; es: string; en: string }) {
    const photoId = mediaMap[photo]
    const result = await payload.create({
      collection: 'speakers',
      data: { name, title, photo: photoId, bio: richText(bios.ca) },
      locale: 'ca',
    })
    // Add ES and EN bios
    await payload.update({
      collection: 'speakers',
      id: result.id,
      data: { bio: richText(bios.es) },
      locale: 'es',
    })
    await payload.update({
      collection: 'speakers',
      id: result.id,
      data: { bio: richText(bios.en) },
      locale: 'en',
    })
    speakerMap[name] = result.id as number
    console.log(`  🎙️  ${name}`)
  }

  // DevFest speakers
  await createSpeaker('Carlos Del Corral', 'Emprendedor Digital', 'carlos_delcorral_opt.jpeg', {
    ca: "Carlos Del Corral és especialista en la implementació pràctica d'intel·ligència artificial generativa en empreses i equips. Ha dirigit acadèmies de formació en IA, ha estat docent en programes de capacitació per a professionals i ha treballat com a freelance aplicant la IA en projectes creatius, audiovisuals i de negoci. Actualment ajuda les organitzacions a integrar la IA als seus processos, amb un enfocament en l'eficiència, l'automatització i noves oportunitats d'innovació.",
    es: "Carlos Del Corral es especialista en implementación práctica de inteligencia artificial generativa en empresas y equipos. Ha dirigido academias de formación en IA, ha sido docente en programas de capacitación para profesionales y ha trabajado como freelance aplicando la IA en proyectos creativos, audiovisuales y de negocio. Actualmente ayuda a organizaciones a integrar la IA en sus procesos, con un enfoque en eficiencia, automatización y nuevas oportunidades de innovación.",
    en: "Carlos Del Corral specializes in bringing generative artificial intelligence into real teams and companies. He has led AI academies, taught professional training programs, and worked as a freelancer applying AI to creative, audiovisual, and business projects. Today he helps organizations integrate AI into their processes with a focus on efficiency, automation, and new opportunities for innovation.",
  })
  await createSpeaker('Maximo Fernandez Nuñez', 'Machine Learning Engineer', 'maximo_fernandez_opt.jpeg', {
    ca: "Máximo Fernandez és enginyer sènior en machine learning amb més de 10 anys d'experiència en el desenvolupament de solucions basades en IA generativa, RAG i agents intel·ligents. Està especialitzat en la creació i optimització de models LLM, el fine-tuning amb LoRA i QLoRA, i el desenvolupament de sistemes multiagent amb tecnologies com Python, PyTorch, Hugging Face, LangChain i LangGraph.",
    es: "Máximo Fernandez es ingeniero sénior en machine learning con más de 10 años de experiencia en el desarrollo de soluciones basadas en IA generativa, RAG y agentes inteligentes. Está especializado en la creación y optimización de modelos LLM, el fine-tuning con LoRA y QLoRA, y el desarrollo de sistemas multiagente con tecnológicas como Python, PyTorch, Hugging Face, LangChain y LangGraph.",
    en: "Maximo Fernandez is a senior machine learning engineer with more than a decade of experience building solutions with generative AI, RAG, and intelligent agents. He specializes in crafting and fine-tuning LLMs with techniques such as LoRA and QLoRA, and in designing multi-agent systems with Python, PyTorch, Hugging Face, LangChain, and LangGraph.",
  })
  await createSpeaker('Mario Ezquerro Saenz', 'Cloud Architect', 'mario_ezquerro_opt.png', {
    ca: "Mario Ezquerro és especialista sènior en DevOps, sistemes Unix i arquitectures cloud, amb més de 20 anys d'experiència en la modernització d'infraestructures tecnològiques. Actualment lidera solucions de microserveis, contenidors i Kubernetes en entorns híbrids i multinúvol a Bosonit.",
    es: "Mario Ezquerro es especialista sénior en DevOps, sistemas Unix y arquitecturas cloud, con más de 20 años de experiencia en la modernización de infraestructuras tecnológicas. Actualmente lidera soluciones de microservicios, contenedores y Kubernetes en entornos híbridos y multinube en Bosonit.",
    en: "Mario Ezquerro is a senior expert in DevOps, Unix systems, and cloud architectures with more than 20 years of experience modernizing technological infrastructures. He currently leads microservices, container, and Kubernetes solutions in hybrid and multi-cloud environments at Bosonit.",
  })
  await createSpeaker('Xavier Portilla Edo', 'Infrastructure Engineer', 'xavier_portilla_opt.png', {
    ca: "Xavier Portilla és un referent internacional en infraestructura cloud, DevOps i desenvolupament d'intel·ligència artificial aplicada. Lidera l'àrea de Cloud Infrastructure a Voiceflow i col·labora com a investigador extern a Princeton University. Reconegut com a Google Developer Expert en AI, Microsoft MVP, GitHub Star i AWS Alexa Champion.",
    es: "Xavier Portilla es un referente internacional en infraestructura cloud, DevOps y desarrollo de inteligencia artificial aplicada. Lidera el área de Cloud Infrastructure en Voiceflow y colabora como investigador externo en Princeton University. Reconocido como Google Developer Expert en AI, Microsoft MVP, GitHub Star y AWS Alexa Champion.",
    en: "Xavier Portilla is an international reference in cloud infrastructure, DevOps, and applied artificial intelligence. He leads the Cloud Infrastructure area at Voiceflow and collaborates as an external researcher at Princeton University. Recognized as a Google Developer Expert in AI, Microsoft MVP, GitHub Star, and AWS Alexa Champion.",
  })
  await createSpeaker('Toni De La Fuente', 'Founder and CEO', 'toni_delafuente_opt.jpeg', {
    ca: "Toni de la Fuente és fundador i CEO de Prowler, l'eina de ciberseguretat al núvol de codi obert més utilitzada del món. Abans de llançar-la va treballar com a enginyer sènior de seguretat a AWS, ajudant organitzacions globals a protegir les seves infraestructures cloud.",
    es: "Toni de la Fuente es fundador y CEO de Prowler, la herramienta de ciberseguridad en la nube de código abierto más utilizada del mundo. Antes de lanzarla trabajó como ingeniero sénior de seguridad en AWS, ayudando a organizaciones globales a proteger sus infraestructuras cloud.",
    en: "Toni de la Fuente is the founder and CEO of Prowler, the world's most widely used open-source cloud security tool. Before launching Prowler he worked as a senior security engineer at AWS, helping global organizations secure their cloud infrastructures.",
  })
  await createSpeaker('Kevin Alberto Sánchez', 'Senior Software Developer', 'kevin_alberto_opt.jpeg', {
    ca: "Kevin Alberto Sánchez Castellanos és desenvolupador sènior de programari amb més de 12 anys d'experiència creant solucions tecnològiques per a sectors com finances, SaaS, recursos humans i pagaments digitals. Especialista en arquitectures .NET, microserveis i API escalables.",
    es: "Kevin Alberto Sánchez Castellanos es desarrollador sénior de software con más de 12 años de experiencia creando soluciones tecnológicas para sectores como finanzas, SaaS, recursos humanos y pagos digitales. Especialista en arquitecturas .NET, microservicios y APIs escalables.",
    en: "Kevin Alberto Sánchez Castellanos is a senior software developer with more than 12 years of experience delivering technology solutions for finance, SaaS, HR, and digital payments. He specializes in .NET architectures, microservices, and scalable APIs.",
  })
  await createSpeaker('María Aperador Montoya', 'Fundadora y CEO', 'maria_aperador_opt.jpeg', {
    ca: "María Aperador Montoya és criminòloga especialitzada en ciberseguretat i risc humà, fundadora i CEO de BeValk i Top Voice a les xarxes, on ha format més de 500.000 persones en seguretat digital. Converteix la recerca criminològica en eines pràctiques per prevenir el frau.",
    es: "María Aperador Montoya es criminóloga especializada en ciberseguridad y riesgo humano, fundadora y CEO de BeValk y Top Voice en redes, donde ha formado a más de 500.000 personas en seguridad digital. Convierte la investigación criminológica en herramientas prácticas para prevenir el fraude.",
    en: "María Aperador Montoya is a criminologist specializing in cybersecurity and human risk, founder and CEO of BeValk, and a Top Voice who has trained more than half a million people in digital security.",
  })
  // March speakers
  await createSpeaker('Omar Helwani', 'Senior Data Engineer', 'conand_1_img6_opt.png', {
    ca: "Omar Helwani és un enginyer de dades especialitzat en dissenyar i optimitzar sistemes de processament de dades a gran escala, facilitant la presa de decisions estratègiques mitjançant solucions eficients, escalables i orientades a resultats.",
    es: "Omar Helwani es un ingeniero de datos especializado en diseñar y optimizar sistemas de procesamiento de datos a gran escala, facilitando la toma de decisiones estratégicas mediante soluciones eficientes, escalables y orientadas a resultados.",
    en: "Omar Helwani is a data engineer specialized in designing and optimizing large-scale data processing systems, enabling strategic decision-making through efficient, scalable, and results-driven solutions.",
  })
  await createSpeaker('Eric Risco', 'AI Tech Lead', 'conand_1_img6_opt.png', {
    ca: "L'Eric Risco és un líder tecnològic en intel·ligència artificial amb una sòlida trajectòria desenvolupant solucions innovadores que connecten el món digital amb les persones, combinant visió estratègica, experiència tècnica i passió per l'ensenyament.",
    es: "Eric Risco es un líder tecnológico en inteligencia artificial con una sólida trayectoria desarrollando soluciones innovadoras que conectan el mundo digital con las personas, combinando visión estratégica, experiencia técnica y pasión por la formación.",
    en: "Eric Risco is a tech leader in artificial intelligence with a strong background in creating innovative solutions that connect the digital world with people, blending strategic vision, technical expertise, and a passion for education.",
  })
  await createSpeaker('Matias Bañeres', 'Cybersecurity Technician', 'conand_1_img6_opt.png', {
    ca: "En Matias Bañeres és tècnic en ciberseguretat, especialitzat en detectar vulnerabilitats i reforçar la defensa digital de les organitzacions.",
    es: "Matias Bañeres es técnico en ciberseguridad, especializado en identificar vulnerabilidades y fortalecer la defensa digital de organizaciones.",
    en: "Matias Bañeres is a cybersecurity technician specializing in identifying vulnerabilities and strengthening the digital defense of organizations.",
  })
  // June speakers
  await createSpeaker('Claudio Amorim', 'Senior Innovation Technician', 'speaker_claudio_amorin_opt.jpeg', {
    ca: "Claudio Amorim, Senior Innovation Technician a Creand (Crèdit Andorrà), lidera projectes d'R+D i desenvolupament de software a Andorra, connectant tecnologia i innovació PoC a PoC.",
    es: "Claudio Amorim, Senior Innovation Technician en Creand (Crèdit Andorrà), impulsa proyectos de I+D y desarrollo de software en Andorra, conectando tecnología e innovación PoC a PoC.",
    en: "Claudio Amorim, Senior Innovation Technician at Creand (Crèdit Andorrà), leads R&D and software development projects in Andorra, connecting technology and innovation PoC to PoC.",
  })
  await createSpeaker('Dimitri Tarasowski', 'AI Developer', 'speaker_dimitri_tarasowski_opt.jpeg', {
    ca: "Dimitri Tarasowski, AI Developer a MVP Foundry i expert en DevOps i cloud, impulsa el desenvolupament àgil de MVPs i la integració d'IA en productes digitals.",
    es: "Dimitri Tarasowski, AI Developer en MVP Foundry y experto en DevOps y cloud, impulsa el desarrollo ágil de MVPs y la integración de inteligencia artificial en productos digitales.",
    en: "Dimitri Tarasowski, AI Developer at MVP Foundry and expert in DevOps and cloud, drives agile MVP development and AI integration into digital products.",
  })
  await createSpeaker('Oriol Matavacas', 'Solutions Architect', 'speaker_oriol_matavacas_opt.jpeg', {
    ca: "Oriol Matavacas, Solutions Architect a AWS, compta amb més de 15 anys dissenyant arquitectures cloud i liderant transformacions digitals per a clients globals, amb experiència multicultural i passió per les tecnologies serverless.",
    es: "Oriol Matavacas, Solutions Architect en AWS, suma más de 15 años diseñando arquitecturas cloud y liderando transformaciones digitales para clientes globales, con experiencia multicultural y pasión por tecnologías serverless.",
    en: "Oriol Matavacas, Solutions Architect at AWS, brings over 15 years of experience designing cloud architectures and leading digital transformations for global clients, with multicultural experience and a passion for serverless technologies.",
  })
  await createSpeaker('Marc Rivero', 'Cybersecurity Expert', 'speaker_marc_rivero_opt.jpeg', {
    ca: "Marc Rivero López és expert en ciberintel·ligència i anàlisi geopolítica, reconegut per la seva tasca en recerca d'amenaces avançades i reverse engineering, i apassionat formador en ciberseguretat.",
    es: "Marc Rivero López es experto en ciberinteligencia y análisis geopolítico, reconocido por su labor en investigación de amenazas avanzadas y reverse engineering, y apasionado formador en ciberseguridad.",
    en: "Marc Rivero López is an expert in cyberintelligence and geopolitical analysis, known for his work in advanced threat research and reverse engineering, and a passionate cybersecurity trainer.",
  })

  // ─── EVENTS ──────────────────────────────────────────────
  console.log('📅 Creating events...')

  // DevFest 2025
  const devfest = await payload.create({
    collection: 'events',
    locale: 'ca',
    data: {
      name: 'CONAND x DevFest 2025 by AndSoft',
      slug: 'devfest',
      year: '2025',
      date: '2025-11-15T09:00:00.000Z',
      status: 'upcoming',
      featuredImage: mediaMap['conand_2_img7_opt1_1.png'],
      description: richText("El DevFest és l'esdeveniment insígnia del circuit de Google, que a Andorra s'organitza juntament amb Conand per continuar impulsant la comunitat tecnològica local. Una trobada que reuneix professionals, estudiants i apassionats del sector amb ponències, tallers i espais de networking pensats per aprendre, compartir experiències i generar noves oportunitats."),
      actionButtons: {
        callForPapersEnabled: false,
        callForPapersUrl: '',
        ticketsEnabled: true,
        ticketsUrl: 'https://conand-devfest-2025.eventbrite.es',
      },
      speakers: [
        speakerMap['Carlos Del Corral'],
        speakerMap['Maximo Fernandez Nuñez'],
        speakerMap['Mario Ezquerro Saenz'],
        speakerMap['Xavier Portilla Edo'],
        speakerMap['Toni De La Fuente'],
        speakerMap['Kevin Alberto Sánchez'],
        speakerMap['María Aperador Montoya'],
      ],
      eventSponsors: [],
      schedule: {
        days: [{ dayDate: '2025-11-15T00:00:00.000Z' }],
        tracks: [{ trackName: 'Saló d\'actes' }, { trackName: 'Sala auxiliar' }],
        sessions: [
          { sessionTitle: 'Benvinguda / Acreditacions', dayIndex: 0, trackIndex: 0, startTime: '09:00', endTime: '09:10' },
          { sessionTitle: 'Keynote i agraïments', dayIndex: 0, trackIndex: 0, startTime: '09:10', endTime: '09:20' },
          { sessionTitle: 'AI-Powered vs Rules-Based Cloud Security', sessionSpeaker: speakerMap['Toni De La Fuente'], dayIndex: 0, trackIndex: 0, startTime: '09:20', endTime: '10:00' },
          { sessionTitle: 'Microserveis, ho estem fent bé?', sessionSpeaker: speakerMap['Kevin Alberto Sánchez'], dayIndex: 0, trackIndex: 0, startTime: '10:00', endTime: '10:40' },
          { sessionTitle: 'Introduction to Firebase Genkit', sessionSpeaker: speakerMap['Xavier Portilla Edo'], dayIndex: 0, trackIndex: 0, startTime: '10:40', endTime: '11:20' },
          { sessionTitle: 'Cafè', dayIndex: 0, trackIndex: 0, startTime: '11:20', endTime: '12:00' },
          { sessionTitle: 'Sponsors', dayIndex: 0, trackIndex: 0, startTime: '12:00', endTime: '12:10' },
          { sessionTitle: 'Agentes del Mañana — Planificació, UX i Memòria', sessionSpeaker: speakerMap['Maximo Fernandez Nuñez'], dayIndex: 0, trackIndex: 0, startTime: '12:10', endTime: '12:50' },
          { sessionTitle: 'La Nova Era dels Ciberatacs', sessionSpeaker: speakerMap['María Aperador Montoya'], dayIndex: 0, trackIndex: 0, startTime: '12:50', endTime: '13:30' },
          { sessionTitle: 'Entorns SRE amb una sola ordre', sessionSpeaker: speakerMap['Mario Ezquerro Saenz'], dayIndex: 0, trackIndex: 0, startTime: '13:30', endTime: '14:10' },
          { sessionTitle: 'Joc i lliurament de regals', dayIndex: 0, trackIndex: 0, startTime: '14:10', endTime: '14:30' },
          // Sala auxiliar
          { sessionTitle: "IA Generativa d'Imatges amb Llenguatge Natural", sessionSpeaker: speakerMap['Carlos Del Corral'], dayIndex: 0, trackIndex: 1, startTime: '10:00', endTime: '10:40' },
          { sessionTitle: 'Taller Hands-On: Seguretat al núvol amb Prowler', sessionSpeaker: speakerMap['Toni De La Fuente'], dayIndex: 0, trackIndex: 1, startTime: '12:00', endTime: '12:40' },
        ],
      },
    },
  })
  // Add ES/EN descriptions
  await payload.update({ collection: 'events', id: devfest.id, locale: 'es', data: {
    description: richText("El DevFest es el evento insignia del circuito de Google, que en Andorra se organiza junto a Conand para seguir impulsando la comunidad tecnológica local. Una cita que reúne a profesionales, estudiantes y entusiastas del sector con ponencias, talleres y espacios de networking pensados para aprender, compartir experiencias y generar nuevas oportunidades."),
  }})
  await payload.update({ collection: 'events', id: devfest.id, locale: 'en', data: {
    description: richText("DevFest is Google's flagship event, organized in Andorra together with Conand to keep boosting the local tech community. A meeting point for professionals, students, and tech enthusiasts with talks, workshops, and networking spaces designed to learn, share experiences, and create new opportunities."),
  }})
  console.log(`  📅 DevFest 2025 created`)

  // March 2025 Meetup
  const march = await payload.create({
    collection: 'events',
    locale: 'ca',
    data: {
      name: 'Conand Meetup March',
      slug: 'meetup-march',
      year: '2025',
      date: '2025-03-29T09:00:00.000Z',
      status: 'past',
      featuredImage: mediaMap['conand_1_img6_opt.png'],
      description: richText("Comença una nova edició del meetup tech a Andorra. Un punt de trobada per a desenvolupadors, emprenedors i apassionats del sector, amb noves ponències, més comunitat i oportunitats per compartir, aprendre i connectar."),
      actionButtons: { callForPapersEnabled: false, ticketsEnabled: false },
      speakers: [speakerMap['Omar Helwani'], speakerMap['Eric Risco'], speakerMap['Matias Bañeres']],
      eventSponsors: [
        { sponsor: sponsorMap['SinzerAD'], tierOverride: 'gold' },
        { sponsor: sponsorMap['Seidor'], tierOverride: 'gold' },
        { sponsor: sponsorMap['TDA'], tierOverride: 'gold' },
        { sponsor: sponsorMap['Andorra la Vella'], tierOverride: 'collaborator' },
        { sponsor: sponsorMap['P.I. Advocats'], tierOverride: 'collaborator' },
      ],
      schedule: { days: [{ dayDate: '2025-03-29T00:00:00.000Z' }], tracks: [{ trackName: 'Main Track' }], sessions: [] },
    },
  })
  await payload.update({ collection: 'events', id: march.id, locale: 'es', data: {
    description: richText("Comienza una nueva edición del meetup tech en Andorra. Un punto de encuentro para desarrolladores, emprendedores y apasionados del sector, con nuevas ponencias, más comunidad y oportunidades para compartir, aprender y conectar."),
  }})
  await payload.update({ collection: 'events', id: march.id, locale: 'en', data: {
    description: richText("A new edition of the Andorra tech meetup kicks off. A gathering point for developers, entrepreneurs, and tech enthusiasts with new talks, more community, and fresh opportunities to share, learn, and connect."),
  }})
  console.log(`  📅 Meetup March 2025 created`)

  // June 2025 Meetup
  const june = await payload.create({
    collection: 'events',
    locale: 'ca',
    data: {
      name: 'Conand Meetup June',
      slug: 'meetup-june',
      year: '2025',
      date: '2025-06-28T09:00:00.000Z',
      status: 'past',
      featuredImage: mediaMap['conand_1_img5_opt.png'],
      description: richText("Arriba a l'estiu la segona trobada tech de l'any. Un punt de trobada per a desenvolupadors, emprenedors i apassionats del sector, amb més ponències, més comunitat i noves oportunitats per connectar, compartir i aprendre."),
      actionButtons: { callForPapersEnabled: false, ticketsEnabled: false },
      speakers: [
        speakerMap['Claudio Amorim'],
        speakerMap['Dimitri Tarasowski'],
        speakerMap['Oriol Matavacas'],
        speakerMap['Marc Rivero'],
      ],
      eventSponsors: [
        { sponsor: sponsorMap['Seidor'], tierOverride: 'gold' },
        { sponsor: sponsorMap['SOSMatic'], tierOverride: 'gold' },
        { sponsor: sponsorMap['Alpine Security'], tierOverride: 'silver' },
        { sponsor: sponsorMap['RCAssociats'], tierOverride: 'silver' },
        { sponsor: sponsorMap['APropSI'], tierOverride: 'bronze' },
        { sponsor: sponsorMap['Actinn'], tierOverride: 'collaborator' },
        { sponsor: sponsorMap['SantaGloria'], tierOverride: 'collaborator' },
        { sponsor: sponsorMap['Andorra Business'], tierOverride: 'collaborator' },
      ],
      schedule: {
        days: [{ dayDate: '2025-06-28T00:00:00.000Z' }],
        tracks: [{ trackName: 'Main Track' }],
        sessions: [
          { sessionTitle: "Keynote d'Obertura", dayIndex: 0, trackIndex: 0, startTime: '09:00', endTime: '09:30' },
          { sessionTitle: 'Structuring data using Neo4j, Rust and Python', sessionSpeaker: speakerMap['Claudio Amorim'], dayIndex: 0, trackIndex: 0, startTime: '09:30', endTime: '10:00' },
          { sessionTitle: '2025 Is the End of Coding. Software Architects Will Lead the Future', sessionSpeaker: speakerMap['Dimitri Tarasowski'], dayIndex: 0, trackIndex: 0, startTime: '10:00', endTime: '10:30' },
          { sessionTitle: 'Pausa cafè', dayIndex: 0, trackIndex: 0, startTime: '10:30', endTime: '11:15' },
          { sessionTitle: 'Presentació Sponsors', dayIndex: 0, trackIndex: 0, startTime: '11:15', endTime: '11:30' },
          { sessionTitle: 'Patrons d\'arquitectura i exemples reals en entorns serverless', sessionSpeaker: speakerMap['Oriol Matavacas'], dayIndex: 0, trackIndex: 0, startTime: '11:30', endTime: '12:00' },
          { sessionTitle: "Atacs dirigits a l'entorn mòbil", sessionSpeaker: speakerMap['Marc Rivero'], dayIndex: 0, trackIndex: 0, startTime: '12:00', endTime: '12:30' },
          { sessionTitle: 'Concurs de preguntes de la Conand', dayIndex: 0, trackIndex: 0, startTime: '12:30', endTime: '13:30' },
        ],
      },
    },
  })
  await payload.update({ collection: 'events', id: june.id, locale: 'es', data: {
    description: richText("Llega en verano el segundo meetup del año. Un punto de encuentro para desarrolladores, emprendedores y apasionados del sector, con más ponencias, más comunidad y nuevas oportunidades para conectar, compartir y aprender."),
  }})
  await payload.update({ collection: 'events', id: june.id, locale: 'en', data: {
    description: richText("The second tech meetup of the year arrives this summer. A gathering point for developers, entrepreneurs, and tech enthusiasts with more talks, more community, and new opportunities to connect, share, and learn."),
  }})
  console.log(`  📅 Meetup June 2025 created`)

  // ─── SITE SETTINGS ──────────────────────────────────────
  console.log('⚙️  Updating Site Settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'ca',
    data: {
      general: {
        siteName: 'CONAND',
        siteDescription: 'CONAND - Conferència tecnològica a Andorra. Meetups, xerrades i networking per impulsar la comunitat tech local.',
        contactEmail: 'contact@con.ad',
        googleAnalyticsId: 'G-GXRBJGRHC3',
      },
      hero: {
        heroImages: [
          { image: mediaMap['conand_2_img7_opt.png'] },
          { image: mediaMap['conand_2_img8_opt.png'] },
          { image: mediaMap['conand_1_img4_opt.png'] },
          { image: mediaMap['conand_1_img5_opt.png'] },
          { image: mediaMap['conand_1_img6_opt.png'] },
        ],
        heroPrimaryButtonText: 'Crida a Ponents',
        heroPrimaryButtonUrl: 'https://con.ad',
        heroSecondaryButtonText: 'Registrar-se',
        heroSecondaryButtonUrl: 'https://con.ad',
      },
      about: {
        aboutImage1: mediaMap['conand_0_img1_opt.jpg'],
        aboutImage2: mediaMap['conand_0_img2_opt.jpg'],
      },
      social: {
        linkedinUrl: 'https://www.linkedin.com/company/conand-conf',
        twitterUrl: 'https://x.com/c0nand',
        youtubeUrl: 'https://www.youtube.com/@conand-y9u',
        twitchUrl: 'https://www.twitch.tv/c0nand',
      },
    },
  })
  // ES/EN site descriptions
  await payload.updateGlobal({ slug: 'site-settings', locale: 'es', data: {
    general: { siteDescription: 'CONAND - Conferencia tecnológica en Andorra. Meetups, charlas y networking para impulsar la comunidad tech local.' },
    hero: { heroPrimaryButtonText: 'Convocatoria de Ponentes', heroSecondaryButtonText: 'Registrarse' },
  }})
  await payload.updateGlobal({ slug: 'site-settings', locale: 'en', data: {
    general: { siteDescription: 'CONAND - Tech conference in Andorra. Meetups, talks and networking to boost the local tech community.' },
    hero: { heroPrimaryButtonText: 'Call for Speakers', heroSecondaryButtonText: 'Register' },
  }})
  await payload.updateGlobal({ slug: 'site-settings', locale: 'fr', data: {
    general: { siteDescription: 'CONAND - Conférence technologique en Andorre. Meetups, conférences et networking pour dynamiser la communauté tech locale.' },
    hero: { heroPrimaryButtonText: 'Appel à Conférenciers', heroSecondaryButtonText: "S'inscrire" },
  }})

  // ─── CREATE ADMIN USER ───────────────────────────────────
  console.log('👤 Creating admin user...')
  const adminEmail = process.env.ADMIN_EMAIL || 'info@conand.ad'
  const adminPassword = process.env.ADMIN_PASSWORD || '8TSTsPIIub6D1Iua'
  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin',
        role: 'admin',
      },
    })
    console.log(`  ✅ Admin user created: ${adminEmail}`)
  } else {
    console.log('  ⏭️  Admin user already exists')
  }

  console.log('\n✅ Seed completed!')
  console.log(`  📸 ${Object.keys(mediaMap).length} images uploaded`)
  console.log(`  🏢 ${Object.keys(sponsorMap).length} sponsors created`)
  console.log(`  🎤 ${Object.keys(speakerMap).length} speakers created`)
  console.log(`  📅 3 events created`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
