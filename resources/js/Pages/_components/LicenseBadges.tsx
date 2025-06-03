// components/LicenseBadges.tsx

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { License } from "@/types/license";

interface StatusBadgeProps {
    status: License["status"];
}

interface TypeBadgeProps {
    type: string;
    isLifetime?: boolean;
    isTrial?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const statusConfig = {
        active: {
            color: "bg-green-100 text-green-800 border-green-200",
            icon: CheckCircle,
            label: "Active",
        },
        expired: {
            color: "bg-red-100 text-red-800 border-red-200",
            icon: XCircle,
            label: "Expired",
        },
        suspended: {
            color: "bg-yellow-100 text-yellow-800 border-yellow-200",
            icon: AlertTriangle,
            label: "Suspended",
        },
        revoked: {
            color: "bg-gray-100 text-gray-800 border-gray-200",
            icon: XCircle,
            label: "Revoked",
        },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
        <Badge className={`${config.color} border`}>
            <IconComponent className="w-3 h-3 mr-1" />
            {config.label}
        </Badge>
    );
};

export const TypeBadge: React.FC<TypeBadgeProps> = ({
    type,
    isLifetime,
    isTrial,
}) => {
    const getTypeColor = (typeCode: string): string => {
        const colors: Record<string, string> = {
            DEMO: "bg-purple-100 text-purple-800 border-purple-200",
            TRIAL: "bg-blue-100 text-blue-800 border-blue-200",
            FULL: "bg-green-100 text-green-800 border-green-200",
            ENT: "bg-orange-100 text-orange-800 border-orange-200",
            EDU: "bg-teal-100 text-teal-800 border-teal-200",
            LIFE: "bg-pink-100 text-pink-800 border-pink-200",
        };
        return colors[typeCode] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    const getTypeLabel = (): string => {
        let label = type;
        if (isLifetime) label += " (Lifetime)";
        if (isTrial) label += " (Trial)";
        return label;
    };

    return (
        <Badge className={`${getTypeColor(type)} border`}>
            {getTypeLabel()}
        </Badge>
    );
};
