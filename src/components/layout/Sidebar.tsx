
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';
import { apiList } from '../../lib/sidebarAPIs';

  
 
  import { 
    ChevronDown, 
    ChevronRight, 
    Grid,
    MessageCircle,
    BookOpen,
    HelpCircle,
    Search,
    User,
  } from 'lucide-react';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';




  // API category type and data structure
  type APICategory = {
    name: string;
    apis: {
      id: string;
      name: string;
      description: string;
    }[];
  };
  
  const apiCategories: APICategory[] = [
    {
      name: 'Analytics',
      apis: [
        { id: 'analyticshq', name: 'AnalyticsHQ', description: 'User behavior tracking & insights' },
        { id: 'metricflow', name: 'MetricFlow', description: 'Real-time data analytics pipeline' },
        { id: 'insightiq', name: 'InsightIQ', description: 'Business intelligence metrics' }
      ]
    },
    {
      name: 'Payments',
      apis: [
        { id: 'orders', name: 'Past Orders', description: 'List previous orders' },
        { id: 'transaction', name: 'Transaction', description: 'Secure transaction creation' }
      ]
    },
    {
      name: 'Communication',
      apis: [
        { id: 'messagenet', name: 'MessageNet', description: 'SMS, email & push notifications' },
        { id: 'chatbridge', name: 'ChatBridge', description: 'Real-time chat integration' },
        { id: 'notifyplus', name: 'NotifyPlus', description: 'Multi-channel notification system' }
      ]
    },
    {
      name: 'AI',
      apis: [
        { id: 'ai-insights', name: 'AI Insights', description: 'Natural language processing' },
        { id: 'visionai', name: 'VisionAI', description: 'Image recognition & analysis' },
        { id: 'predictionml', name: 'PredictionML', description: 'Machine learning predictions' }
      ]
    },
    {
      name: 'Storage',
      apis: [
        { id: 'cloudstore', name: 'CloudStore', description: 'Scalable object storage' },
        { id: 'blobvault', name: 'BlobVault', description: 'Secure blob storage service' },
        { id: 'datawarehouse', name: 'DataWarehouse', description: 'Big data storage solutions' }
      ]
    },
    {
      name: 'Authentication',
      apis: [
        { id: 'authguard', name: 'AuthGuard', description: 'Secure authentication & authorization' },
        { id: 'identitycore', name: 'IdentityCore', description: 'Identity management system' },
        { id: 'ssoprovider', name: 'SSOProvider', description: 'Single sign-on integration' }
      ]
    },
    {
      name: 'Database',
      apis: [
        { id: 'querymaster', name: 'QueryMaster', description: 'Advanced database operations' },
        { id: 'nosqlcloud', name: 'NoSQLCloud', description: 'Document-based database service' },
        { id: 'relationalx', name: 'RelationalX', description: 'SQL database as a service' }
      ]
    }
  ];


  
  const Sidebar = () => {
    // const location = useLocation();
    const pathname = usePathname();
    
    const isApiPath = (path: string) => {
      return path.startsWith('/api-docs/');
    };
  
    const currentApiId = isApiPath(pathname) ? 
      pathname.split('/api-docs/')[1] : '';
  
    return (
      <aside className="w-64 h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden 
       fixed left-0 scrollbar-thin scrollbar-track-devscribe-dark-gray
       scrollbar-thumb-devscribe-hover-bg/80 hover:scrollbar-thumb-devscribe-hover-bg/90"
      >
        <div className="flex flex-col h-full">



        {/* This is where the api marketplace and deepsearch buttons are */}
          {/* <div className="px-6 py-2">
            <nav className="space-y-1">
              <Link 
                href="/api-marketplace" 
                className={`
                  sidebar-link text-white font-bold
                  flex items-center gap-4 
                  px-4 py-2 
                  transition-all duration-200 
                  hover:text-white 
                  ${pathname === '/api-marketplace' ? 'bg-codium-hover-bg' : ''}
                `}
              >
                <Grid size={18} />
                <span>API Marketplace</span>
              </Link>
              <Link 
                href="/api-deepsearch" 
                className={`
                  sidebar-link text-white font-bold
                  text-[14px]
                  flex items-center gap-4 
                  px-4 py-2 rounded-md 
                  transition-all duration-200 
                  hover:bg-codium-hover-bg 
                  hover:text-white 
                  ${pathname === '/api-deepsearch' ? 'bg-codium-hover-bg' : ''}
                `}
              >
                <Search size={18} />
                <span>API Deepsearch</span>
              </Link>
            </nav>
          </div> */}

          <div className="px-6 py-2">
              <div 
                className={`
                  sidebar-link text-white font-bold
                  flex items-center gap-4 
                  px-4 py-2 
                  transition-all duration-200 `}
                >
                <User size={18} />
                <span>Devscribe</span>
              </div>
          </div>



  
          {/* Resources Section */}
          <div className="sidebar-section">
            <div className="sidebar-heading text-white mb-2 pr-6 font-bold">
              {/* <span>Home</span> */}
            </div>
            
            <div className="mt-1 space-y-1">
              <Link 
                href="/" 
                className={`
                  sidebar-link font-bold
                  flex items-center gap-4 
                  pl-8 py-2 rounded-md 
                  transition-all duration-200 
                  ${pathname === '/' ? 'text-white' : 'text-devscribe-text-secondary'}
                `}
              >
                <MessageCircle size={18} />
                <span>Home</span>
              </Link>
              <Link 
                href="/edit" 
                className={`
                  sidebar-link font-bold
                  flex items-center gap-4 
                  pl-8 py-2 rounded-md 
                  transition-all duration-200 
                  hover:devscribe-hover-bg
                  text-devscribe-text-secondary
                  ${pathname === '/edit' ? ' text-white' : 'text-devscribe-text-secondary'}
                `}
              >
                <BookOpen size={18} />
                <span>Editor</span>
              </Link>
              <Link 
                href="/documentation" 
                className={`
                  sidebar-link font-bold
                  flex items-center gap-4 
                  pl-8 py-2 rounded-md 
                  transition-all duration-200 
                  hover:bg-codium-hover-bg 
                  text-codium-text-secondary
                  ${pathname === '/documentation' ? 'text-white' : 'text-devscribe-text-secondary'}
                `}
              >
                <HelpCircle size={18} />
                <span>Documentation</span>
              </Link>
            </div>
          </div>
  
          {/* Getting Started Section */}
          {/* <div className="sidebar-section mt-4">
            <div className="sidebar-heading text-white mb-2 px-6 font-bold">
              <span>GETTING STARTED</span>
            </div>
            
            <div className="mt-1 space-y-1">
              <Link 
                href="/api-quickstart" 
                className={`
                  sidebar-link font-bold
                  flex items-center gap-4 
                  px-10 py-2 rounded-md 
                  transition-all duration-200 
                  hover:bg-codium-hover-bg 
                  text-codium-text-secondary
                `}
              >
                <span>Quickstart Guide</span>
              </Link>
              <Link 
                href="/api-authentication" 
                className={`
                  sidebar-link font-bold
                  flex items-center gap-4 
                  px-10 py-2 rounded-md 
                  transition-all duration-200 
                  hover:bg-codium-hover-bg 
                  text-codium-text-secondary
                `}
              >
                <span>Authentication</span>
              </Link>
              <Link 
                href="/api-best-practices" 
                className={`
                  sidebar-link font-bold
                  flex items-center gap-4 
                  px-10 py-2 rounded-md 
                  transition-all duration-200 
                  hover:bg-codium-hover-bg 
                  text-codium-text-secondary
                `}
              >
                <span>Best Practices</span>
              </Link>
            </div>
          </div> */}
  
          {/* API Categories Section */}
          {/* <div className="sidebar-section mt-4">
            <div className="sidebar-heading text-white mb-2 px-6 font-bold">
              <span>API Categories</span>
            </div>
            
            <div className="mt-1 space-y-1">
              {apiList.map((api) => (
                <Link
                  key={api.id}
                  href={`/api-docs/${api.id}`}
                  className={`
                    sidebar-link font-bold
                    flex items-center 
                    px-10 py-2 rounded-md 
                    transition-all duration-200 
                    hover:bg-codium-hover-bg 
                    w-full
                    ${currentApiId === api.id ? 'bg-codium-hover-bg text-white' : 'text-codium-text-secondary'}
                  `}
                >
                  <div className="w-full text-left">
                    <div className="truncate">{api.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div> */}




          {/* API Categories Section */}
          {/* <div className="sidebar-section mt-4">
            <div className="sidebar-heading text-white mb-2 px-6 font-bold">
              <span>API Categories</span>
            </div>
            
            <div className="mt-1 space-y-1">
              {apiCategories.map((category) => {
                const [isOpen, setIsOpen] = useState(category.apis.some(api => api.id === currentApiId));
                
                return (
                  <Collapsible 
                    key={category.name} 
                    open={isOpen} 
                    onOpenChange={setIsOpen}
                  >
                    <CollapsibleTrigger className={`
                      sidebar-link font-bold
                      flex items-center justify-between 
                      px-10 py-2 rounded-md 
                      transition-all duration-200 
                      hover:bg-codium-hover-bg 
                      text-codium-text-secondary
                      w-full
                    `}>
                      <div className="flex items-center gap-4 flex-grow">
                        <span className="truncate">{category.name}</span>
                      </div>
                      <div>
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-2 pl-4 border-l border-devscribe-border space-y-1 py-1">
                        {category.apis.map((api) => (
                          <Link
                            key={api.id}
                            href={`/api-docs/${api.id}`}
                            className={`
                              sidebar-link font-bold
                              flex items-center 
                              px-10 py-2 rounded-md 
                              transition-all duration-200 
                              hover:bg-codium-hover-bg 
                              w-full
                              ${currentApiId === api.id ? 'bg-codium-hover-bg text-white' : 'text-codium-text-secondary'}
                            `}
                          >
                            <div className="w-full text-left">
                              <div className="truncate">{api.name}</div>
                              <div className="text-xs text-codium-text-secondary truncate">{api.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div> 
            </div>*/}

          
        </div>
      </aside>
    );
  };
  
  export default Sidebar;
  