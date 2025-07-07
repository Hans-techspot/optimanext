import React from 'react';
import { useStore } from '@nanostores/react';
import {
  providerStore,
  setProvider,
  type Provider,
  ProviderType,
  togetherModels,
  anthropicModels,
  googleModels,
  xAIModels,
} from '@/lib/stores/provider';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';

export function ProviderSelector() {
  const currentProvider = useStore(providerStore);
  const [isProviderMenuOpen, setIsProviderMenuOpen] = React.useState(false);

  const handleProviderChange = (value: Provider) => {
    console.log('handleProviderChange called with:', value);
    setProvider(value);
  };

  return (
    <DropdownMenu onOpenChange={(open) => setIsProviderMenuOpen(!open)}>
      <DropdownMenuTrigger asChild  >
        <Button variant="ghost" className="flex justify-between p-1.5 ml-2">
          <div className="flex items-center max-w-[150px] truncate text-sm">
            {currentProvider.type === ProviderType.ANTHROPIC
              ? `${currentProvider.model.displayName}`
              : currentProvider.type === ProviderType.GOOGLE
              ? `${currentProvider.model.displayName}`
              : `${currentProvider.model.displayName}`}
          </div>
          {isProviderMenuOpen ? (
            <ChevronUpIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          ) : (
            <ChevronDownIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background w-[250px] max-h-[50vh] overflow-y-auto font-light">
        <DropdownMenuRadioGroup
          value={JSON.stringify(currentProvider)}
          onValueChange={(value) => handleProviderChange(JSON.parse(value))}
        >
          <DropdownMenuLabel className='pl-1 rounded-sm bg-secondary text-accent font-bold text-sm w-full'>Anthropic Models</DropdownMenuLabel>
          {anthropicModels.map((model) => (
            <DropdownMenuRadioItem
              key={model.id}
              value={JSON.stringify({ type: ProviderType.ANTHROPIC, model })}
              className=""
            >
              {model.displayName}
            </DropdownMenuRadioItem>
          ))}
          <DropdownMenuLabel className='pl-1 rounded-sm bg-secondary text-accent font-bold text-sm w-full'>Google Models</DropdownMenuLabel>
          {googleModels.map((model) => (
            <DropdownMenuRadioItem
              key={model.id}
              value={JSON.stringify({ type: ProviderType.GOOGLE, model })}
              className=""
            >
              {model.displayName}
            </DropdownMenuRadioItem>
          ))}
          <DropdownMenuLabel className='pl-1 rounded-sm bg-secondary text-accent font-bold text-sm w-full'>xAI Models</DropdownMenuLabel>
          {xAIModels.map((model) => (
            <DropdownMenuRadioItem
              key={model.id}
              value={JSON.stringify({ type: ProviderType.XAI, model })}
              className=""
            >
              {model.displayName}
            </DropdownMenuRadioItem>
          ))}
          <DropdownMenuLabel className='pl-1 rounded-sm bg-secondary text-accent font-bold text-sm w-full'>TogetherAI Models</DropdownMenuLabel>
          {togetherModels.map((model) => (
            <DropdownMenuRadioItem
              key={model.id}
              value={JSON.stringify({ type: ProviderType.TOGETHER, model })}
              className=""
            >
              {model.displayName}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}