export type NavItem = {
    label: string;
    href: string;
};

export type CaseStudy = {
    slug?: string;
    code: string;
    category: string;
    title: string;
    summary: string;
    meta: string;
    image: string;
    imageMobile?: string;
    imageAlt: string;
    tags?: string[];
};

export type Note = {
    number: string;
    title: string;
    category: string;
    date: string;
};

export const navItems: NavItem[] = [
    { label: "能力", href: "/#capability" },
    { label: "交付物", href: "/#deliverables" },
    { label: "合作方式", href: "/#engagement" },
    { label: "案例与笔记", href: "/cases/" },
];

export const masthead = {
    left: "FIELD NOTES NO. 01 / ECOMCANOPY",
    right: "CROSS-BORDER COMMERCE X AI",
};

export const siteMeta = {
    brand: "EcomCanopy",
    cnName: "易贸森",
    tagline: "易贸森 / 跨境电商 × AI 的一人技术工作室。懂业务，也写代码；从现场把系统交付到上线。",
    email: "hzhihu@ecomcanopy.site",
};

export const scopeItems = [
    "跨境卖家、运营团队",
    "海外仓公司、电商软件服务商",
    "技术负责人、早期创业团队",
];

export const capabilities = [
    {
        number: "01",
        label: "BUSINESS MODEL / 业务建模",
        title: "先读懂业务，再写代码",
        description:
            "订单、库存、海外仓、物流、Listing 不是五张表，是一条会出错的链路。先把字段口径、异常与人工兜底理清，再动手建模。",
        image: "/images/home-capability-model.jpg",
        imageMobile: "/images/home-capability-model-mobile.png",
        imageAlt: "深色业务系统界面示意",
        caption: "FIG. 02 / ORDER FLOW BOARD",
    },
    {
        number: "02",
        label: "FORWARD DEPLOYED / 现场交付",
        title: "一个人，端到端负责上线",
        description:
            "需求澄清、原型、开发、上线、值守、迭代由同一人完成。需求不用在三方之间反复翻译，出问题也不必先找谁背锅。",
        image: "/images/home-capability-fde.jpg",
        imageMobile: "/images/home-capability-fde-mobile.png",
        imageAlt: "深色部署与监控界面示意",
        caption: "FIG. 03 / DEPLOYMENT RUNBOOK",
    },
    {
        number: "03",
        label: "AGENT ENGINEERING / Agent 工程",
        title: "把 Agent 放进有边界的系统",
        description:
            "不是聊天窗口。权限、可观测、可回滚、人工确认节点先搭好，再让模型接手具体的判断与执行。",
        image: "/images/home-capability-agent.jpg",
        imageMobile: "/images/home-capability-agent-mobile.png",
        imageAlt: "深色 Agent 工作流界面示意",
        caption: "FIG. 04 / AGENT WORKFLOW",
    },
];

export const deliverables = [
    {
        name: "01 / 业务系统与数据管道",
        description:
            "订单、库存、海外仓、物流、Listing 的统一模型与同步链路；字段口径写进文档，异常有兜底。",
    },
    {
        name: "02 / AI Agent 与工作流",
        description:
            "带权限、可观测、可回滚的 Agent，嵌进具体岗位与审批节点，而不是一个独立的聊天窗口。",
    },
    {
        name: "03 / 集成与自动化",
        description:
            "平台 API、ERP、WMS、表格与内部工具之间的胶水层，替换掉最容易出错的人工复制粘贴。",
    },
    {
        name: "04 / 交付文档与上线值守",
        description:
            "架构说明、运行手册、回滚步骤与上线后的迭代节奏；交接之后，系统仍然有人懂。",
    },
];

export const trustPoints = [
    {
        title: "01 / 不转包",
        description: "需求、开发与上线由同一人负责，问题不用来回转述。",
    },
    {
        title: "02 / 不承诺万能",
        description: "Agent 能做什么、不能做什么，在方案阶段就写清楚。",
    },
    {
        title: "03 / 可交接",
        description: "文档、回滚步骤与值守节奏随系统一起交付。",
    },
];

export const engagementOptions = [
    {
        name: "问题诊断 / 约 2 周",
        description: "梳理业务与数据现状，给出可执行的系统方案与优先级。",
    },
    {
        name: "端到端交付 / 按项目",
        description: "从建模到上线，含 AI Agent、业务系统与集成；范围与报价按项目确认。",
    },
    {
        name: "长期技术伙伴 / 按月",
        description: "持续迭代、值守与二次开发，适合系统已经跑起来之后。",
    },
];

export const faqs = [
    {
        question: "和外包开发有什么不同？",
        answer: "外包交付功能，我交付跑在业务里的系统：先蹲流程、再定边界，上线后继续值守和迭代。",
    },
    {
        question: "已经有一套 ERP 了还能接吗？",
        answer: "能。多数项目是从现有系统的缝隙开始的：补同步、补自动化、补 Agent，而不是推翻重来。",
    },
    {
        question: "Agent 会直接改线上数据吗？",
        answer: "不会默认放行。写操作有权限、审批与回滚路径，关键节点保留人工确认。",
    },
];

export const caseStats = [
    { value: "24", label: "案例研究 / CASE STUDIES" },
    { value: "52", label: "现场笔记 / FIELD NOTES" },
    { value: "16", label: "方法随想 / ESSAYS" },
    { value: "08", label: "覆盖行业 / INDUSTRIES" },
];

export const featuredCase: CaseStudy = {
    slug: "fulfillment-ai",
    code: "CASE 001 / 跨境履约",
    category: "跨境履约",
    title: "从订单到海外仓，\n把 AI 交付到跨境履约现场",
    summary:
        "一个覆盖 8 个行业的中台如何长出来：从订单归集、库存同步到异常件预测，记录 90 天里真正起作用的那些决定。",
    meta: "2026.11  /  8 MIN READ",
    image: "/images/case-001-warehouse.jpg",
    imageMobile: "/images/case-001-warehouse-mobile.jpg",
    imageAlt: "海外仓分拣通道",
    tags: ["跨境履约", "AI 调度", "系统交付"],
};

export const caseStudies: CaseStudy[] = [
    {
        code: "CASE 002 / 数据治理",
        category: "数据治理",
        title: "把散在 6 个系统里的订单，收敛成一张表",
        summary: "多平台归集、幂等同步与对账闭环，一次讲清楚数据一致性的取舍。",
        meta: "2026.09  /  6 MIN READ",
        image: "/images/case-002-dashboard.jpg",
        imageMobile: "/images/case-002-dashboard-mobile.jpg",
        imageAlt: "深色数据看板",
    },
    {
        code: "CASE 003 / 库存同步",
        category: "库存同步",
        title: "海外仓库存同步：把延迟压进 30 秒",
        summary: "多仓库存与在途件的实时对齐，以及超卖预警怎么落到现场。",
        meta: "2026.08  /  5 MIN READ",
        image: "/images/case-003-port.jpg",
        imageMobile: "/images/case-003-port-mobile.jpg",
        imageAlt: "港口集装箱堆场",
    },
    {
        code: "CASE 004 / 异常预测",
        category: "异常预测",
        title: "让异常件提前 48 小时被看见",
        summary: "不追求大模型，从规则与轻量模型开始，把预测接进客服工单。",
        meta: "2026.07  /  4 MIN READ",
        image: "/images/case-004-notebook.jpg",
        imageMobile: "/images/case-004-notebook-mobile.jpg",
        imageAlt: "摊开的笔记本与钢笔",
    },
];

export const notes: Note[] = [
    { number: "N.052", title: "为什么我坚持先写交付清单，再动第一行代码", category: "方法", date: "2026.11.18" },
    { number: "N.051", title: "一个人做系统，最该省掉的是哪些流程", category: "随想", date: "2026.11.04" },
    { number: "N.050", title: "现场调研三天，比开两周会更有用", category: "方法", date: "2026.10.22" },
    { number: "N.049", title: "AI 落地失败，多半不是模型的问题", category: "随想", date: "2026.10.09" },
    { number: "N.048", title: "把「上线」当作起点，而不是交付的终点", category: "方法", date: "2026.09.26" },
];

export const article = {
    slug: "fulfillment-ai",
    eyebrow: "CASE 001   /   跨境履约",
    fieldNote: "FIELD NOTE  /  2026.11.18  /  8 MIN READ",
    title: "从订单到海外仓，\n把 AI 交付到跨境履约现场",
    subtitle:
        "From Orders to Overseas Warehouses — shipping AI into the real world of cross-border fulfillment.",
    intro:
        "一个覆盖 8 个行业的中台如何长出来：从订单归集、库存同步到异常件预测，记录 90 天里真正起作用的那些决定，以及那些被我们刻意放弃的部分。",
    introMobile:
        "一个覆盖 8 个行业的中台如何长出来：从订单归集、库存同步到异常件预测，记录 90 天里真正起作用的那些决定，以及那些被反复推翻的设想。",
    author: "文 / hzhihu",
    date: "2026.11.18",
    readTime: "8 MIN READ",
    category: "精选案例",
    cover: "/images/article-cover-warehouse.jpg",
    coverMobile: "/images/article-cover-warehouse-mobile.png",
    coverAlt: "明亮仓库中的货架与作业人员",
    coverCaption: "图 01 / 华东某跨境履约仓的分拣现场，2026 年秋。摄影：hzhihu",
    lead:
        "去年秋天，我接手了一个看起来并不复杂的需求：把散在六个渠道里的订单汇总起来，让仓库不再靠三张 Excel 对账。三个月后，长出来的东西比最初设想的要多，也比最初设想的要克制。这篇文章不谈模型，只谈那些真正让系统跑起来的决定。",
    sections: [
        {
            id: "start",
            number: "01  /  起点",
            title: "不是模型，是一张对不上的库存表",
            paragraphs: [
                "第一次去现场，仓管把三台显示器转过来给我看：平台后台、ERP、还有一张每天手工更新的共享表。同一批货，三个地方的数字都不一样。那一刻我很确定，问题不在预测算法，而在于连「现在到底有多少货」这件事都没有一个统一的答案。",
                "于是前两周我们没写任何智能逻辑，只做了一件笨事：给每一件货、每一次移动建立唯一的事实来源。订单归集、库存同步、状态回写，三条链路打通之后，那张共享表自然就消失了。",
            ],
            quote: {
                text: "先让数据说实话，再让模型做判断。顺序反了，再漂亮的准确率都是假的。",
                source: "— 项目第 14 天，写在白板右下角",
            },
        },
        {
            id: "decisions",
            number: "02  /  决定",
            title: "只让系统做三件事",
            paragraphs: [
                "需求会自己膨胀。第二个月，团队列了十七个「顺便也能做」的功能，我把它们全部放进了一张纸上，然后只留下三条真正影响履约结果的。其余的，不是不做，是还不该做。",
            ],
            list: [
                "订单归集与去重：六个渠道进同一个口子，重复的、拆单的、改址的都在这里被消化掉。",
                "库存快照与对账：每十五分钟一次快照，差异自动标红，人只需要处理异常，不再逐行核对。",
                "异常件预测：只对「可能出问题」的包裹做提醒，把有限的人力放到真正需要判断的地方。",
            ],
            image: "/images/article-inline-laptop.jpg",
            imageMobile: "/images/article-inline-desk-mobile.jpg",
            imageAlt: "桌面上打开的笔记本电脑与数据看板",
            imageCaption: "图 02 / 上线前一周的联调现场：所有异常都会先落到这张台面上。",
        },
        {
            id: "delivery",
            number: "03  /  交付",
            title: "上线不是终点，是开始有人用了",
            paragraphs: [
                "系统真正被接受，是在仓管开始主动提需求的那一周。第 90 天，六条渠道的订单已经全部走同一条链路，异常件的处理时间从平均 40 分钟压到 6 分钟。比数字更重要的，是他们不再需要那张共享表了。",
            ],
            closing: "写给同样在现场做系统的人：先把边界画清楚，再谈智能。剩下的，时间会替你把答案写出来。",
        },
    ],
    tags: ["跨境履约", "AI 调度", "系统交付"],
    results: [
        {
            value: "6 条",
            title: "渠道订单统一归集",
            note: "六个平台，一个入口，不再手工合并对账",
        },
        {
            value: "6 min",
            title: "异常件平均处理时长",
            note: "从 40 分钟压到 6 分钟，人只处理真正的异常",
        },
        {
            value: "0 张",
            title: "仍在使用的共享 Excel",
            note: "上线第 90 天，那张对账表彻底退出了现场",
        },
    ],
    resultNote: "数据来自项目上线后第 90 天的现场记录，为单一客户案例，不代表通用基准。",
    previous: "现场调研三天，比开两周会更有用",
    next: "一个人做系统，最该省掉的是哪些流程",
    related: [
        {
            category: "N.050  /  方法",
            title: "现场调研三天，比开两周会更有用",
            meta: "2026.10.22   /   7 MIN READ",
            image: "/images/related-boxes.jpg",
            imageMobile: "/images/related-notes-mobile.jpg",
            imageAlt: "仓库桌面上的纸箱与记录板",
        },
        {
            category: "N.049  /  随想",
            title: "AI 落地失败，多半不是模型的问题",
            meta: "2026.10.09   /   6 MIN READ",
            image: "/images/related-desk.jpg",
            imageMobile: "/images/related-ledger-mobile.jpg",
            imageAlt: "窗边桌面上的笔记本电脑与茶杯",
        },
        {
            category: "CASE 002  /  库存",
            title: "把「上线」当作起点，而不是交付的终点",
            meta: "2026.09.26   /   9 MIN READ",
            image: "/images/related-warehouse.jpg",
            imageMobile: "/images/related-aisle-mobile.jpg",
            imageAlt: "整齐的仓库货架通道",
        },
    ],
};

export function getCaseBySlug(slug: string) {
    return [featuredCase, ...caseStudies].find((item) => item.slug === slug);
}
