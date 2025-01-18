import Image from 'next/image';
import Link from 'next/link'

const SocialMedia = () => (
    <div className="fixed bottom-4 right-4 space-x-4">
      <Link href="https://zalo.me/" target="_blank" rel="noreferrer">
          <Image height={200} width={200} src="/icons/homepage/icons-messenger.svg" alt="Messenger" className="w-8 h-8 transform hover:scale-110 transition-transform" />
      </Link>
      <Link href="https://zalo.me/" target="_blank" rel="noreferrer">
          <Image height={200} width={200} src="/icons/homepage/icons-phone.svg" alt="Phone" className="w-8 h-8 transform hover:scale-110 transition-transform" />
      </Link>
      <Link href="https://zalo.me/" target="_blank" rel="noreferrer">
          <Image height={200} width={200} src="/icons/homepage/icons-zalo.svg" alt="Zalo" className="w-8 h-8 transform hover:scale-110 transition-transform" />
      </Link>
    </div>
  );
  
  export default SocialMedia;